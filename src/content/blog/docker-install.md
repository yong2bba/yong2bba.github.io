---
title: "도르마무...가 아니라 도커(Docker) 설치"
meta_title: "도르마무...가 아니라 도커(Docker) 설치 — Yongjin"
description: "Ubuntu Server에 Docker를 설치하는 방법을 기록합니다."
date: 2025-12-07T00:00:00+09:00
image: "/assets/ghost/docker-install/01-freepik__-yongjin-__75455.png"
author: "Yongjin"
categories: ["Tech"]
tags: ["Tech", "HomeServer"]
draft: false
---
## 목차

![도르마무...가 아니라 도커(Docker) 설치](/assets/ghost/docker-install/01-freepik__-yongjin-__75455.png)

이사를 하면서 이전에 서버로 사용하던 미니 PC가 주거씀다... 아아 그는 좋은 홈서버였습니다. 그래서 새로운 콤퓨타를 사서 우분투 서버를 설치하려는데 어떻게 설치했었는지 기억이 나질 않습니다... 따라서 이제 잊어먹지 않기 위해 블로그에다가도 방법을 적어놓겠습니다. (기억은 어쩌구 기록은 어쩌구)

## Docker 설치 방법

Ubuntu 24.04.3 기반인 Ubuntu Server 설치 기준입니다.

### 1. 설치 전 준비

1) 이전에 설치했을지도 모르는 Docker를 삭제해줍니다.

```
sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
```

2) 기존 패키지를 업데이트합니다.

```
sudo apt update
```

3) Docker 설치 시 필요한 패키지를 설치합니다.

```
sudo apt install -y ca-certificates curl gnupg
```

### 2. Docker Keyring 설치

1) Docker의 GPG 키 관리를 위한 keyring 디렉터리를 생성합니다.

```
sudo install -m 0755 -d /etc/apt/keyrings

```

2) Docker 의 GPG 키를 다운로드 받아 저장합니다.

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

3) Keyring 폴더에 있는 GPG key를 사용할 수 있게 권한을 부여합니다.

```
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 3. Docker APT 저장소 등록 및 설치

1) Docker 공식 저장소를 APT에 등록합니다.

```
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

2) 다시 패키지 목록 업데이트

```
sudo apt update
```

3) Docker 엔진 설치로 끝!

```
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```
