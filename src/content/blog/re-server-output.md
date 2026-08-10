---
title: "Re:Server output"
meta_title: "Re:Server output — Yongjin"
description: "서비스기획자 용진입니다. Re:Server - 03. 서버보다 AI 이야기가 더 많은 서버 재설치 마지막 이야기 에서 나온 결과물만 따로 포스"
date: 2025-08-17T00:00:00+09:00
image: "/images/ghost/re-server-output/01-feature-1.webp"
author: "Yongjin"
categories: ["Tech"]
tags: ["Tech", "HomeServer"]
draft: false
source: "ghost"
original_url: "https://www.yongjin.dev/re-server-output/"
---
## 목차

![Re:Server output](/images/ghost/re-server-output/01-feature-1.webp)

서비스기획자 용진입니다. [**Re:Server - 03. 서버보다 AI 이야기가 더 많은 서버 재설치 마지막 이야기**](/blog/re-server-03)에서 나온 결과물만 따로 포스팅합니다.

## docker-compose.yml

```
version: '3.8'

services:
  # Traefik 리버스 프록시
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    command:
      - --api.dashboard=true
      - --api.insecure=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --providers.file.directory=/etc/traefik/dynamic
      - --providers.file.watch=true
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --log.level=INFO
      - --accesslog=true
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Traefik 대시보드
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./config/traefik:/etc/traefik/dynamic:ro
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.${DOMAIN}`)"
      - "traefik.http.routers.traefik.entrypoints=web"
      - "traefik.http.services.traefik.loadbalancer.server.port=8080"

  # Cloudflare Tunnel
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    networks:
      - traefik-network
    depends_on:
      - traefik

  # 테스트용 서비스 (whoami)
  whoami:
    image: traefik/whoami
    container_name: whoami
    restart: unless-stopped
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.rule=Host(`whoami.${DOMAIN}`)"
      - "traefik.http.routers.whoami.entrypoints=web"
      - "traefik.http.services.whoami.loadbalancer.server.port=80"

  # 또 다른 테스트 서비스 (nginx)
  nginx-test:
    image: nginx:alpine
    container_name: nginx-test
    restart: unless-stopped
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nginx-test.rule=Host(`web.${DOMAIN}`)"
      - "traefik.http.routers.nginx-test.entrypoints=web"
      - "traefik.http.services.nginx-test.loadbalancer.server.port=80"

networks:
  traefik-network:
    driver: bridge
```

## .env

```
# 도메인 설정 (yoursite.com을 실제 도메인으로 변경)
DOMAIN=yoursite.com

# Cloudflare Tunnel 토큰 (실제 토큰으로 변경)
CLOUDFLARE_TUNNEL_TOKEN=your_cloudflare_tunnel_token_here
```

## config/traefik/dynamic.yml

```
# Traefik 동적 설정 파일
# 추가적인 라우팅 규칙이나 미들웨어를 여기에 정의할 수 있습니다.

http:
  middlewares:
    # 보안 헤더 추가
    secure-headers:
      headers:
        accessControlAllowMethods:
          - GET
          - OPTIONS
          - PUT
        accessControlMaxAge: 100
        hostsProxyHeaders:
          - "X-Forwarded-Host"
        referrerPolicy: "same-origin"

    # HTTPS 리다이렉트 (필요한 경우)
    https-redirect:
      redirectScheme:
        scheme: https
        permanent: true

  routers:
    # API 라우터 (대시보드 보안 강화용)
    api:
      rule: "Host(`traefik.yoursite.com`)"
      service: "api@internal"
      middlewares:
        - "secure-headers"
```
