---
title: "돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik"
meta_title: "돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik — Yongjin"
description: "돈 아끼려고 n8n 셀프 호스팅을 시도했다가 결국 홈서버를 구축해버린 제 이야기입니다. 정말 서버 인프라 담당하시는 분들이 존경스러워지는 경험입니다."
date: 2025-06-21T00:00:00+09:00
image: "/images/ghost/homeserver-01-n8n-traefik/01-feature.webp"
author: "Yongjin"
categories: ["Tech"]
tags: ["Tech", "HomeServer"]
draft: false
source: "ghost"
original_url: "https://www.yongjin.dev/homeserver-01-n8n-traefik/"
---
## 목차

🙏

지금 이 내용은 홈 서버 안정화 이후 매우 오랜 시간이 흐른 뒤에 기억을 더듬어 작성하는 내용입니다. 중간 과정이 생략되어도 너그러이 봐주세요.

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik](/images/ghost/homeserver-01-n8n-traefik/01-feature.webp)

## 미약한 시작

안녕하세요. 서비스기획자 용진입니다.

ChatGPT를 시작으로 요즘 세상은 유래가 없을 정도로 휙휙 바뀌는 느낌입니다. 자다 일어나면 신기술이 쏟아져나오고 있는 게 요즘이죠. OpenAI에서 무언가 내놓으면 Google에서도 새로운 걸 내놓고, 그러면 Anthropic에서 곧바로 새로운 것을 내놓는 세상입니다. 무서울 정도로 달려가는 세상인데 저도 조금이라도 더 공부해야하겠죠. 라고 생각했었습니다.

### n8n을 self-host로 사용해보기로 하다.

그러한 공부를 위해, 저는 n8n이라는 자동화 툴을 사용해보기로 했었습니다. 자동화 툴에서 make가 유명하지만 제대로 사용해보려면 어느정도의 요금을 지불해야하죠. 가벼운 지갑사정과 학습용으로 그렇게까지 돈을 써야하는지? 에 대한 고민에 포기하려는 찰나, n8n을 알게 되었습니다.

n8n은 현재 make보다는 사용 가능한 자동화 node의 수가 적지만 계속적으로 발전해나가고 있고, mcp나 agent와 같은 AI 지원도 충실합니다. 그리고 오픈 소스이기 때문에 제가 호스팅하여서 사용하면 충분히 혼자서도 사용 가능하죠. 마침 집에 n100 CPU를 사용하는 미니 PC도 하나 놀고 있기 때문에 한번 도전해보기로 했습니다.

### n8n을 docker compose로 설치하는 법

n8n 문서에는 친절하게 [docker compose로 n8n을 설치하는 방법](https://docs.n8n.io/hosting/installation/server-setups/docker-compose/?ref=yongjin.dev)을 알려줍니다. 해당 링크로 들어가보시면 다음과 같이 보일겁니다.

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik](/images/ghost/homeserver-01-n8n-traefik/02-1.webp)

아무것도 모르고 덤볐다가 여기까지 오게 될 줄은 몰랐지요...

근데 전 기획자이지 개발자가 아니잖아요? 그러니깐 ChatGPT의 도움을 받아서 진행해보기로 했습니다. 첫 결과는? 당연히 안됩니다. 왜 안되었는가? 여기서부터는 눈물이 앞을 가리기 시작합니다.

## 나는 왜 삽질을 하였나?

### 나는 몰랐네... 정말 몰랐네...

이제와서 하는 이야기지만, n8n에서 제공해준 docker compose.yml은 다음과 같이 구성되어 있습니다.

```
services: ## docker의 서비스를 돌리는 부분입니다.
  n8n: ## 이 부분이 n8n 부분입니다.
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "127.0.0.1:5678:5678"
    ...
  traefik: ## 이 부분은 다른 서비스인 traefik이라는 서비스를 설정/실행하는 부분입니다.
    image: "traefik"
    restart: always
    ...
volumes:
  n8n_data:
  traefik_data:
```

처음 설치할 당시의 저는 전혀 모르는 일이었기 때문에 그렇구나 라고 생각했습니다. 저보다 개발이나 서버 인프라 설치를 잘 아는 사람이 말하면 그런가보다 하게 되잖아요? 그렇기 때문에 저는 n8n에서 제공해주는 traefik 내용이 맞다고 생각하고 '헐... 그럼 어떻게 해?' 하면서 계속 ChatGPT가 시키는대로 복사, 붙여넣기, 안되서 좌절하기만 반복하고 있었죠. 그럼 이렇게 절 좌절시켰던 traefik이라는 놈은 뭐일까요?

### traefik은 무엇이길래?

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik](/images/ghost/homeserver-01-n8n-traefik/03-2.webp)

traefik의 캐릭터입니다. 그때는 몰랐는데 지금 보니 나름 traefik 서비스의 이미지를 잘 표현하네요.

traefik 웹페이지에서 **traefik은 서비스와 API를 쉽게 배포할 수 있도록 도와주는, 현대적인 오픈 소스 리버스 프록시이자 인그레스 컨트롤러**라고 소개하고 있습니다. 오픈 소스는 오픈 소스이고 리버스 프록시? 인그레스 컨트롤러?

서비스기획자가 너무 깊숙하게 들어가봐야 개발자들 비웃음만 살테니 간단하게 설명하면 우리가 우리의 접속 정보를 감추기 위해 프록시를 사용하는 것처럼, 서버도 자신들의 주소를 감추기 위해 사용하는 게 리버스 프록시인 것이고, traefik은 이러한 리버스 프록시를 도와주는 서비스인거죠. 아무래도 서버의 주소를 직접 노출시키면 3G 속도로 개인정보를 털어가도 모르는 SKT와 같이 해커의 직접 타겟이 되기 쉬우니깐요.

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik](/images/ghost/homeserver-01-n8n-traefik/04-3.webp)

사실 traefik은 로드 밸런싱이나 다른 재미있는 기능도 많습니다. 제가 못쓰는 것 뿐이죠.

### 그렇다면 단일 서비스만 사용한다면 굳이 traefik을 사용할 이유가?

없죠. 사실 그냥 n8n만 올려도 상관없었을 겁니다. 그렇지만 n8n을 그냥 로컬 개발서버로만 올려서 사용할 때 문제가 되는 부분이 있습니다. 바로 웹훅webhook 입니다.

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik](/images/ghost/homeserver-01-n8n-traefik/05-4.webp)

API 폴링과 웹훅의 차이점을 이해하시겠나요? (참고: 토스페이먼트 개발자센터 [https://docs.tosspayments.com/resources/glossary/webhook](https://docs.tosspayments.com/resources/glossary/webhook?ref=yongjin.dev))

계속 준비 상태를 물어봐야하는 API와는 다르게 웹훅은 내가 준비되었을때만 데이터를 전송하고 받기 때문에 계속 데이터를 주고받는 행위를 하지 않아도 되어 편리하고 효율적입니다. 그런데 웹훅이 무슨 상관이냐구요? 웹훅은 다음과 같이 URL을 가지게 되거든요.

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik](/images/ghost/homeserver-01-n8n-traefik/06-5.webp)

현재 제가 돌리고 있는 서버에서 n8n을 실행 뒤 웹훅 트리거를 실행하면 다음과 같이 표시됩니다. 웹훅은 URL로 표시됩니다.

결국 제 n8n에서 자동화를 테스트하고 상시적으로 굴릴 수 있게 하려면 도메인이 필수라는 이야기가 됩니다. 그런데 요즘 도메인에는 보안을 위해 https://을 사용하잖아요? http가 아닌 https를 사용하려면 SSL/TLS 인증서가 필요합니다. traefik은 이러한 인증서를 받아서 관리하는 역할도 합니다. 아까 docker compose.yml에서 이 부분입니다.

```
    command:
      - "--entrypoints.web.address=:80"
      ## http로 들어온다면 80포트로 들어옵니다. 보통 일반적이죠.
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      ## 그치만 80포트로 들어오면 보안이 안좋으니 https로 던져버리라는 뜻입니다.
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      ## 던질 때 https를 붙여서 던지라는거죠.
      - "--entrypoints.websecure.address=:443"
      ## 일반적인 https는 443포트로 들어옵니다.
      - "--certificatesresolvers.mytlschallenge.acme.tlschallenge=true"
      ## ssl/tls 인증서 받을래? 물어보는 부분입니다. 당근빠다 받는거죠.
      - "--certificatesresolvers.mytlschallenge.acme.email=${SSL_EMAIL}"
      ## 받거나, 받지 못하면 그 결과를 메일로 받을텐데 그 메일주소입니다.
      - "--certificatesresolvers.mytlschallenge.acme.storage=/letsencrypt/acme.json"
      ## ssl/tls 인증서를 저장하는 부분입니다.
```

제가 안된 부분도 이 부분이었습니다. 이전 우분투가 아닌 promox와 npmNginx Proxy Manager node.js에서 패키지 관리하는 npm과 글자는 같지만 달라요 를 사용해보려다가 때려친 이유도 npm에서 도저히 ssl/tls을 해결할 수 없어서였거든요. 이게 traefik에서도 마찬가지로 제 발목을 잡은거지요. 진짜 traefik과 멱살을 잡고 싸우는 느낌이었다고나 할까요.

![돈 아끼려고 n8n 셀프호스팅 했다가 홈 서버 만든 이야기 (1) n8n 호스팅과 traefik](/images/ghost/homeserver-01-n8n-traefik/07-6.webp)

인터넷을 뒤질 때 어떤 글을 하나 보게 됩니다. 그리고 장대한 삽질의 여정이 추가되죠. 하지만 그건 다음 시간에 쓰도록 하고 오늘은 여기까지만!

> traefik하고 cloudflare tunnel로 서비스를 구축한...
