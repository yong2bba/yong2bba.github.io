---
title: "돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (3) 지금은 어떻게 굴리니?"
meta_title: "돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (3) 지금은 어떻게 굴리니? — Yongjin"
description: "현재 제가 운영하는 홈서버를 대략적으로 소개해봅니다."
date: 2025-06-21T00:00:00+09:00
image: "/images/ghost/homeserver-03-nowadays/01-yongjins_A_highly_detailed_anthropomorphic_cartoon_dragon_with__45db66a8-45db-4103-95b1-93d4fba3e849.png"
author: "Yongjin"
categories: ["Tech"]
tags: ["Tech", "HomeServer"]
draft: false
source: "ghost"
original_url: "https://www.yongjin.dev/homeserver-03-nowadays/"
---
## 목차

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (3) 지금은 어떻게 굴리니?](/images/ghost/homeserver-03-nowadays/01-yongjins_A_highly_detailed_anthropomorphic_cartoon_dragon_with__45db66a8-45db-4103-95b1-93d4fba3e849.png)

안녕하세요. 서비스기획자 용진입니다.

돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 [(1) n8n 호스팅과 traefik](/blog/homeserver-01-n8n-traefik)과 [(2) Cloudflare tunnel](/blog/homeserver-02-cloudflare-tunnel) 모두 읽어주신 분들, 둘 중 하나만 읽어주신 분들, 둘 다 안읽었지만 이 글을 보는 분 모두 감사 인사 드립니다.

원래는 N8N 이외의 서비스 설치 관련된 이야기를 해볼까 했는데, 사람들이 N8N에 관심이 높은 거 같아 일단 현재 제 설정을 한번 공유해볼까 합니다.

## 현재 설정

### N8N 설치 전에 Docker Compose부터

N8N을 그냥 설치하려면 상관없지만 Docker를 통해 관리하려면 당연하겠지만 Docker와 Docker compose 설치가 필수입니다. Windows로 사용하실 분들은 그냥 Docker Desktop 쓰시는 게 편할 수도 있으니 그 부분을 참고하시고, 저처럼 미니PC가 있고 리눅스를 설치하신 분들이라면 다음과 같이 설치하시거나 ChatGPT의 도움을 받아보시는 걸 추천합니다.

```
# 의존성 패키지 설치
sudo apt-get update
sudo apt-get install ca-certificates curl

# GPC키 추가
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 레포지토리 설정
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker와 Docker compose 설치하기
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 파일 트리

우선 제 설정의 제일 근간이 되었던(?) N8N에서 제공하는 Docker compose로 설정하는 법은 [N8N 문서](https://docs.n8n.io/hosting/installation/server-setups/docker-compose/?ref=yongjin.dev#6-create-docker-compose-file)에서 확인 가능합니다. 하지만 이제 저 설정과는 너무나도 멀어진 상태군요. 현재 제 홈서버는 파일트리는 다음과 같습니다.

```
/docker-service
  │
  ├── archivebox
  │   └── docker-compose.yml
  ├── bytestash
  │   └── docker-compose.yml
  ├── minio
  │   └── docker-compose.yml
  ├── monitoring
  │   ├── docker-compose.yml
  │   └── prometheus
  │       └── prometheus.yml
  ├── n8n
  │   └── docker-compose.yml
  ├── send
  │   └── docker-compose.yml
  └──docker-compose.yml
```

Docker-service라는 폴더에 traefik과 cloudflared의 네트워크를 구성하는 docker-compose 파일과 .env 파일이 있고 폴더 하위에 각 서비스별로 docker-compose 파일과 .env 파일을 분리하는 구성으로 되어있습니다. 단일 docker-compose 파일로 구성하는 것보다 업데이트나 신규 서비스 추가에 유리하고, 제가 못찾을 가능성도 줄어들기 때문에 다음과 같이 정리해놓았지요.

### Traefik & Cloudflare Tunnels

현재 Docker 안에서 Bridge network와 외부와의 연결을 담당하는 Traefik과 Cloudflare Tunnels이 담겨있는 docker-compose.yml 입니다.

```
version: "3.7"

services:
  traefik:
    image: "traefik:v2.10"
    container_name: traefik
    restart: always
    env_file:
      - .env
    command:
      - "--api.dashboard=true"
      - "--entrypoints.dashboard.address=:8080"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.customport.address=:9091"
      - "--metrics.prometheus=true"
      - "--metrics.prometheus.entrypoint=dashboard"
    # - "--entrypoints.websecure.address=:443"
    # - "--certificatesresolvers.mytlschallenge.acme.tlschallenge=true"
    # - "--certificatesresolvers.mytlschallenge.acme.email=${SSL_EMAIL}"
    # - "--certificatesresolvers.mytlschallenge.acme.storage=/letsencrypt/acme.json"
    ports:
      - 80:80
      - 443:443
      - 8080:8080
    volumes:
      - traefik_data:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - traefik_network
    labels:
      - traefik.enable=true
      - traefik.http.routers.traefik.rule=Host(`traefik.${DOMAIN_NAME}`)
      - traefik.http.routers.traefik.entrypoints=dashboard
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.routers.mixpost.entrypoints=customport
    # - traefik.http.routers.traefik.tls.certresolver=mytlschallenge

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    networks:
      - traefik_network

volumes:
  traefik_data:
    external: true

networks:
  traefik_network:
    external: true

```

Cloudflared 설정은 특별한 게 없는데, Traefik에서는 N8N에서 제안했던 Traefik 설정과는 다른 부분이 다음과 같이 있습니다.

```
    command:
      - "--api.dashboard=true" # 대시보드를 표시합니다
      - "--entrypoints.dashboard.address=:8080"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.customport.address=:9091"
      # 서버 관리를 위해 프로메테우스를 사용합니다.
      - "--metrics.prometheus=true"
      - "--metrics.prometheus.entrypoint=dashboard"
      # SSL/TLS 인증서 부분을 막아두었습니다.
    # - "--entrypoints.websecure.address=:443"
    # - "--certificatesresolvers.mytlschallenge.acme.tlschallenge=true"
    # - "--certificatesresolvers.mytlschallenge.acme.email=${SSL_EMAIL}"
    # - "--certificatesresolvers.mytlschallenge.acme.storage=/letsencrypt/acme.json"
    ports:
      - 80:80
      - 443:443
      - 8080:8080
    labels:
      - traefik.enable=true
      - traefik.http.routers.traefik.rule=Host(`traefik.${DOMAIN_NAME}`)
      - traefik.http.routers.traefik.entrypoints=dashboard
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.routers.mixpost.entrypoints=customport
      # 위와 마찬가지로 SSL/TLS 인증서 부분을 막아두었습니다.
    # - traefik.http.routers.traefik.tls.certresolver=mytlschallenge
```

.env 파일은 다음과 같이 설정하시면 됩니다.

```
DOMAIN_NAME=example.com
SSL_EMAIL=your@gmail.com
CLOUDFLARE_TUNNEL_TOKEN=ey...
```

이전에 설명드렸다시피 제 모든 서비스는 traefik_network 안에서 서로 통신합니다. 제 설정을 가져다 쓰시려면 Docker 안에서 해당 네트워크를 만들어줘야 합니다. 데이터 저장도 마찬가지로 저는 Docker volume을 사용하기 때문에 같이 만들어주면 편합니다.

```
docker network create traefik_network # traefik_network 설치
docker network ls # network 설치 확인
docker volume create traefik_data # traefik_data 생성
docker volume ls # volume 설치 확인
```

N8N에서는 따로 Traefik의 대시보드를 설정하지 않는 방법을 제공했는데 저는 어쩌다보니 Traefik 대시보드를 살려버리게 되었습니다. 저는 종종 확인하는 편이지만 N8N만 사용하신다면 굳이 사용할 필요는 없을 거 같아요.

### N8N 서비스

Traefik을 분리했기 때문에 N8N 서비스를 설치하는 docker-compose.yml은 조금 더 단순하게 구성되어 있습니다.

```
version: "3.7"

services:
  n8n:
    image: "docker.n8n.io/n8nio/n8n"
    container_name: n8n
    restart: always
    env_file:
      - ../.env
      - .env
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n8n.rule=Host(`n8n.${DOMAIN_NAME}`)"
      - "traefik.http.routers.n8n.entrypoints=web"
    environment:
      - N8N_HOST=n8n.${DOMAIN_NAME}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.${DOMAIN_NAME}/
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - traefik_network

volumes:
  n8n_data:
    external: true

networks:
  traefik_network:
    external: true

```

여기서도 중요한 부분은 label과 environment 입니다.

```
labels:
  # traefik을 사용하고, traefik에서 n8n.example.com으로 요청받은 정보를 라우팅하라는 뜻입니다.
  - "traefik.enable=true"
  - "traefik.http.routers.n8n.rule=Host(`n8n.${DOMAIN_NAME}`)"
  - "traefik.http.routers.n8n.entrypoints=web"
environment:
  - N8N_HOST=n8n.${DOMAIN_NAME}
  - N8N_PORT=5678 # N8N의 내부 포트번호입니다
  - N8N_PROTOCOL=https # N8N은 https를 사용합니다
  - NODE_ENV=production # dev가 아닌 실제 운용 단계를 사용합니다.
  - WEBHOOK_URL=https://n8n.${DOMAIN_NAME}/ # 웹훅의 URL입니다.
```

마지막으로 n8n_data 라는 docker volume도 생성해줍니다.

```
docker volume create n8n_data
docker volume ls
```

### Docker compose 실행

이렇게 설정을 해준 docker-compose.yml은 해당 폴더 안에서 다음과 같이 실행해줍니다.

```
docker compose up -d
```

최초 실행 시에는 이미지를 받아와서 조금 오래 걸릴 수도 있지만 실행되고 나서 실행하면 큰 문제없이 되실거라 생각합니다. 그리고 전 Cloudflare Tunnels를 사용하잖아요? Tunnels도 설정해줘야 합니다.

### Cloudflare Tunnels 설정

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (3) 지금은 어떻게 굴리니?](/images/ghost/homeserver-03-nowadays/02----------------------------------------------------Cloudflare-One-05-27-2025_09_24_PM.png)

네트워크 > Tunnels 에서 공개 호스트 이름을 찾아 등록하기를 누르면 됩니다.

Tunnels에서 제가 설정하는 방식은 다음과 같습니다. 하위 도메인은 이전 docker-compose.yml에서 설정한 서브 도메인을 넣어주고 도메인은 해당 도메인을 넣어줍니다. 그리고 서비스의 유형은 HTTP(cloudflare까지 올 때는 그냥 http로 가니깐 HTTP로 해줘야합니다.) URL은 n8n(서비스명):5678(포트명)과 같이 적어줍니다. 그리고 저장하면 끝입니다.

## 수많은 시행착오가 있었지만 대충 이정도입니다

이렇게 설정하기까지 꽤 많은 실패를 반복하였습니다. 그래도 이젠 이런 방식으로 충분히 서비스를 추가하고 운영할 수 있어서 편하게 운영 중입니다. 여러분도 홈서버를 운영해보고 싶으시다면 한번 시도해보시는 걸 추천드립니다. 저는 조만간 업그레이드를 계획하고 있으니 다음에는 업그레이드 컨텐츠로 찾아오겠네요(?)
