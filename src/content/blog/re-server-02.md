---
title: "Re:Server - 02. 안이 외않되?"
meta_title: "Re:Server - 02. 안이 외않되? — Yongjin"
description: "미니PC 업그레이드 이후에 서버 설정에 실패한 과정을 복기하고 왜 실패했는지를 회고해보는 포스트입니다."
date: 2025-07-20T00:00:00+09:00
image: "/images/ghost/re-server-02/01-feature-1.webp"
author: "Yongjin"
categories: ["Tech"]
tags: ["Tech", "HomeServer"]
draft: false
source: "ghost"
original_url: "https://www.yongjin.dev/re-server-02/"
---
## 목차

![Re:Server - 02. 안이 외않되?](/images/ghost/re-server-02/01-feature-1.webp)

안녕하세요. 서비스기획자 용진입니다. 1편 이후로 오랜 시간이 흘렀군요. 별로 기다리시지는 않았겠지만, 회사가 바빴습니다(...) 잠깐 지난 1편을 복기하면, 서버 업그레이드를 완료했고, 우분투 서버 설치도 잘 했으며, SSH를 통한 접속까지 완료하였습니다. 그럼 2편을 시작하도록 하죠.

## 홈서버는 홈서버입니다.

제 미니PC는 이제 RAM 32GB와 1TB의 SSD storage를 갖추게 되었습니다. 간단한 홈 서버로 사용하기에는 이미 충분한 스펙이지만, 갑자기 여기서 LLM을 돌리거나 할 수 있는 스펙은 또 아닙니다. CPU가 intel N100이니깐요. 물론 다른 것을 해보고 싶지 않았던 것은 아니었습니다. 그 유명한 쿠버네티스Kubernetes(K8s), 컨테이너화된 애플리케이션의 배포, 확장 및 관리를 자동화하는 도구로 구축을 해볼까 하는 생각도 없지 않았죠.

![Re:Server - 02. 안이 외않되?](/images/ghost/re-server-02/02-1.webp)

쿠버네티스 클러스터를 도식화한 내용입니다. 제가요? 이걸요? 왜요?

하지만 잠깐 문서를 살펴보고 여러 블로그를 뒤적인 뒤 제가 내린 결론은 다음과 같았습니다. ‘오케스트레이션Orchestration, 여러 개의 컴퓨터 시스템, 애플리케이션 및/또는 서비스를 조율하고 관리하는 것? 로드 밸런싱Load Balancing, 여러 서버에 걸쳐 네트워크 트래픽을 분산시켜 특정 서버의 과부하를 방지하고, 서비스의 안정성과 가용성을 높이는 기술? 이건 내가 건드릴 것이 아니군.’ K8s를 자연스럽게 포기했으니 K3s도 자연스럽게 포기하게 되었죠. Docker Swarm? 아까 포기한 로드 밸런싱을 굳이? 제 서버는 미니PC 하나잖아요? 결국 돌고 돌아서 결론은 ‘기존에 했던 방식으로 홈서버를 재구축’인 것입니다.

기존 방식대로 Docker를 사용하고 traefik과 Cloudflare tunnel 조합으로 네트워크를 연결해 사용하기로 합니다. 이전 홈서버와 같이 traefik과 Cloudflare tunnel만 잘 설정해놓으면 새로운 서비스를 올리기가 쉽거든요. 저는 이렇게 했습니다.

1. 내가 새로 올리고 싶은 웹 어플리케이션의 Github에 있는 docker-compose(A).yml을 가져옵니다.
1. 현재 잘 돌아가는 서비스의 docker-compose(B).yml와 함께 ChatGPT에게 던져줍니다.
1. ChatGPT에 다음과 같이 요청합니다.
"내 홈서버에서 잘 돌아가는 (B)를 참고해서 내가 새로 올려볼 (A)를 내 홈서버에서도 잘 돌아갈 수 있게 만들어줘."
1. ChatGPT가 docker-compose(A').yml를 만들어줍니다.
1. 디렉토리에 잘 저장한 뒤 **docker compose up -d**
1. Profit!

그래도 혹시 더 좋은 아이디어가 있을까하여 ChatGPT에게 홈서버 구축에 대해 물어보았습니다. 그랬더니 'Docker Compose + Cloudflare tunnel + traefik + **Portainer**' 조합을 저에게 추천해주는 것이 아니겠습니까?

## Portainer는 모죠?

![Re:Server - 02. 안이 외않되?](/images/ghost/re-server-02/03-2.webp)

Portainer.io 페이지에 나온 Portainer를 설명한 내용입니다.

[Portainer.io](http://portainer.io/?ref=yongjin.dev) 웹페이지에서 “Portainer는 종합적인 컨테이너 관리 플랫폼”이라고 소개하고 있습니다. Docker가 컨테이너라는 개념을 대중화시키긴 했지만 컨테이너 자체는 Docker의 고유한 기술이 아니라 리눅스에서 제공하는 여러 기능(네임스페이스라던가, cgroups 라던가...)을 활용한 기술이니만큼 다른 서비스에서도 Docker와 유사하게 컨테이너 개념을 제공하고 있습니다.

Docker와 거의 유사한 너무 유사해서 명령어도 호환되는 Podman이라는 서비스가 있고 위에서 언급했던 쿠버네티스도 컨테이너를 사용합니다. 더 나아가서 여러 대의 물리 서버를 사용하는 Docker Swarm도 컨테이너를 사용하고Docker Swarm도 Docker잖아 AWS, Google Cloud, Microsoft Azure과 같은 클라우드 서비스에서도 컨테이너 기능을 활용하고 있습니다.

이렇게 환경이 다양해지고 복잡해지면 CLI 환경, 즉 터미널을 통해 서버에 접속해서 해당 디렉토리로 이동하고 docker-compose.yml을 생성, 실행시키거나 로그 확인을 위해 docker에 명령어를 직접 때려넣는 것을 하기가 어려워집니다. 직관적으로 어디에 있는지 알 수 없으니깐요. 아무리 개발자들이 터미널 환경을 좋아하더라도 헷갈리는 것은 헷갈리는거죠. 그렇기때문에 GUI를 통해 다양한 환경이라는 것을 쉽게 식별하고 내가 원하는 환경에 접속, 컨테이너를 구축할 수 있게 만든 서비스가 Portainer 라고 생각하면 되겠습니다.

이전에 Synology NAS에서도 잠깐 Portainer를 시도한 적이 있었기에 해당 서비스에 대해 알고 있었습니다. 그 때는 포트 포워딩과 리버스 프록시의 어려움 때문에 하다가 때려쳤었지만, 지금의 저는 Cloudflare tunnel로 포트 포워딩을 대신하고 리버스 프록시에는 traefik을 사용하고 있기 때문에 문제가 전혀 없습니다. 저는 바로 ChatGPT에게 'Cloudflare tunnel + traefik + Portainer'로 구성한 저의 홈서버의 제일 근간이 될만한 docker-compose.yml을 만들어달라고 요청하고 저는 과감하게 ‘docker compose up -d’ 명령어로 실행하였습니다. 그리고 저는 404 not found를 보았습니다.

## Retrospect

'왜 안되었는가?' 를 논하기 전에, 저는 서비스기획자이며, 인프라 쪽과는 전혀 무관한 삶을 살았기 때문에 어찌보면 이전에는 잘 돌아갔던 게 신기한 상황이기도 합니다. 그러니 ‘이전에는 왜 되었나?’ 를 생각하는 것이 안된 이유를 찾기 더 좋겠죠.

### 왜 잘 되었을까?

#### 1. n8n에서 제공하는 괜찮은 docker-compose.yml

저는 처음에 홈서버를 돌릴 생각이 없었습니다. 단순히 AWS나 DigitalOcean과 같은 가상 컴퓨팅 서비스없이 24시간 n8n 워크플로우를 돌려도 비용이 안나오기를(물론 전기료는 나오겠지만) 원했죠. 그러다가 셀프 호스팅Self-hosting이라는 것을 알았고 n8n과 같은 오픈 소스는 셀프 호스팅에도 우호적이기 때문에 셀프 호스팅을 위한docker-compose.yml을 공식 문서에서 제공해줍니다. 그리고 여기서 저는 traefik을 통해 서비스를 잘 돌리는 것이 보장된 docker-compose.yml을 얻을 수 있었죠.

![Re:Server - 02. 안이 외않되?](/images/ghost/re-server-02/04-3.webp)

[n8n 문서](https://docs.n8n.io/hosting/installation/server-setups/docker-compose/?ref=yongjin.dev#5-create-local-files-directory)에 친절하게 기재된 Docker Compose.yml의 도움을 많이 받았죠.

#### 2. 작은 목표: n8n만 제대로 돌려보자!

traefik 대시보드가 어쩌다가 성공하면서 홈서버 구축이 되긴 했지만 당시 제 목표는 '24시간동안 켜놔도 비용이 나오지 않는 내 미니PC에 n8n 올리기'였습니다. 명확한 목표죠. 그리고 해당 내용을 달성하면서 n8n 이외의 서비스로도 확장이 된 것이죠.

#### 3. 그리고 Cloudflare tunnel 한 스푼 추가

마지막으로 SSL/TLS과 포트 포워딩Port Forwarding을 해결하기 위해 방법을 열심히 찾아보다가 Cloudflare tunnel을 발견한 것, 그리고 정말 빠르게 적용해서 문제없이 작동했다는 점이 있을겁니다.

### 그럼 이번에는 외않됬데?

가장 큰 문제는 저렇게 홈서버를 구축한 이후 별 무리없이 서비스를 올리는 것이 가능했다보니 기초 인프라의 중요성에 대해 간과했던 것이죠. 특히 Cloudflare tunnel 설정하는 것이 생각보다 복잡하더라구요.

#### 1. 제대로 설정하지 않고 사용하는 Cloudflare tunnel

이전에 빠르게 적용해서 문제없이 작동했기에 '왜 되는가?'에 대해 생각하지 않았습니다. 그렇기에 이번에 새로 설정하면서 'cloudflare 설정을 서버에서 config로 해라', 'config에서 ingress를 설정해야한다' 라는 ChatGPT의 설명을 보며 당황했죠.

ingress가 대체 뭐죠? 저는 이전에 그런 것을 설정하지 않았단 말입니다...

> ingress 설정을 통해 **특정 도메인이나 경로로 들어오는 트래픽을 특정 로컬 서비스로 연결**할 수 있습니다. 예를 들어, `app.example.com`으로 접속하면 내부의 웹 서버로, `api.example.com`으로 접속하면 내부 API 서버로 연결되도록 설정할 수 있습니다. Cloudflare tunnel은 YAML 형식의 설정 파일을 사용하며 이 파일에는 ingress 규칙을 정의하며, 각 규칙은 `hostname` (접속할 도메인)과 `service` (연결할 내부 서비스)를 포함합니다.

```
ingress:
  - hostname: app.example.com
    service: <http://localhost:8080>  # 로컬 웹 서버
  - hostname: api.example.com
    service: <http://localhost:3000> # 로컬 API 서버
```

나중에 알게 되었지만, 이건 결국 제가 Cloudflare의 Zero Trust에서 네트워크를 설정하던 그것과 같은 것입니다. 이런 설정을 내 홈서버 내부에서 보내는것과 Cloudflare 대시보드 화면에서 하는 것의 차이인거죠. 하지만 설정하던 당시의 저는 알지 못하고 그저 ChatGPT가 시키는대로 열심히 수정하고 에러를 보는 것의 반복이었죠.

#### 2. 검증없는 docker-compose.yml made by ChatGPT

이전 홈서버를 구축할 당시 n8n에서 제공하는 docker-compose.yml은 상당히 훌륭한 것이었습니다. traefik을 제대로 설치하고 n8n 서비스에 라벨링도 잘 달려있는 물건이였죠. 그렇지만 이번에는 저는 그러한 과정없이 ChatGPT에게 바로 'Cloudflare tunnel + traefik + Portainer'를 조합한 docker-compose.yml을 달라고 했고 이를 바로 적용해버렸죠. 어떠한 확인도 없이 말이죠.

ChatGPT는 기본적으로 LLMLarge Language Model, 대규모 언어 모델입니다. 계산을 통해 가장 괜찮은 단어와 조사를 붙여서 보여주는 것이 ChatGPT인 것이죠. 인터넷에 올라온 수많은 정보들로 학습했다고는 하지만 그 정보가 맞는지는 담보할 수 없다는 겁니다. '실수할 수 있습니다.'라는 면피 문장이 괜히 모든 LLM에 달려있는 게 아니라는거죠.

나중에 알게된 연결이 안된 이유는 Cloudflare tunnel과 traefik에서 SSL/TLS를 둘 다 설정했기 때문입니다. 저번 홈서버 설정에서도 언급했지만, Cloudflare tunnel을 사용하게 되면 tunnel 이후에서만 https로 보이게하는 게 편합니다. tunnel 안쪽에서 굳이 인증서를 붙여가면서 https를 사용할 이유가 없는거죠. tunnel에는 http가 올거라고 설정했는데 traefik에서 websecure(443)을 사용해서 https로 설정하고 tunnel에 보내버리니 tunnel에서는 '이게 뭣이여'하고 연결을 안해버리는 것이죠.

그런데 설정할 당시에 컨테이너의 로그를 전달해주었을 때 ChatGPT는 저 문제를 인식하지 못하고 'Cloudflared의 ingress 설정과 traefik의 라벨 설정의 문제'라고 잘못 이해하고 저에게 잘못된 해결책을 전달한 것입니다. 저는 아무 생각없이 따라치고, 문제는 계속 반복되었죠. 저는 지쳐갔습니다.

#### 3. 잃어버린 목표: Portainer 를 통한 docker container 의 GUI 관리 욕심

사실 Portainer는 Docker Compose를 쉽게 사용할 수 있는 도구일뿐이지 주요한 서비스는 아니었습니다. 여차하면 그냥 Docker Compose만 사용해도 충분하죠. 그렇기 때문에 Portainer 서비스를 띄우는 것이 목표가 아닌 Cloudflare tunnel과 traefik만으로 홈서버 접속이 잘 된다는 것을 확인하는 것이 우선이었어야 했습니다. 하지만 저는 ChatGPT에게 계속 Portainer가 뜨지 않는다라는 질문만 반복했고 결국 ChatGPT도 저에게 'Cloudflare tunnel + Portainer 조합'의 docker-compose.yml을 안내해주게 되었죠. 비록 성공은 했지만 제가 원하던 것이 아니었습니다. 저는 여기서 완전히 놓아버렸죠.

## 결론: 그런데 지금은 홈서버 잘 돌리고 있잖아요?

![Re:Server - 02. 안이 외않되?](/images/ghost/re-server-02/05-4.webp)

Prometheus와 Loki를 통해 서버 로그와 상태를 수집하고 Grafana에서 확인한 현재 제 서버의 모습입니다.

네 맞아요. 잘 돌리고 있죠. 지금 글을 쓰고 있는 현재 37개의 컨테이너를 쌩쌩 돌리고 있습니다. 어떻게 성공했냐구요? ChatGPT가 아닌 Claude의 도움으로요(...) 지금까지 쓴 내용만으로도 거의 3000자가 넘었기에 Claude와 함께 성공한 내용은 다음 포스트에서 작성해야겠어요. 안녕!
