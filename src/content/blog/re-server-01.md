---
title: "Re:Server - 01. Upgrade Complete"
meta_title: "Re:Server - 01. Upgrade Complete — Yongjin"
description: "취미는 저지르는 것입니다. firebat AK2를 업그레이드한 뒤 Ubuntu Server를 설치하는 과정을 기록하였습니다."
date: 2025-07-01T00:00:00+09:00
image: "/assets/ghost/re-server-01/01-feature.webp"
author: "Yongjin"
categories: ["Tech"]
tags: ["Tech", "HomeServer"]
draft: false
---
## 목차

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/01-feature.webp)

안녕하세요. 서비스기획자 용진입니다.

오늘부터 당분간은 6/28~29에 진행했던 제 홈서버 업그레이드와 재구축에 대한 이야기를 해볼까 합니다. 바쁜 현생을 살면서 얼마나 열심히 쓸 지는 잘 모르겠지만 일단 써놔야 기억을 할 수 있으니깐요. 그럼 시작합니다.

## Q. 왜 서버를 업그레이드 하시나요?

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/02-yongjinss.png)

취미는 그냥 하는 것입니다. 취미니깐요.

## Q. 무엇을 업그레이드 했나요?

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/03-1.jpeg)

왼쪽부터 제 현재 PC, KLEVV 의 1TB SSD, RZX의 32GB RAM, ARCTIC MX-4 서멀 구리스

저는 1년 전에 구입한 firabat AK2라는 미니PC를 사용하고 있었습니다. 간단한 홈서버로 사용하기 좋은 스펙이었지만 RAMRandom Access Memory과 SSDSolid-State Drive가 무언가 부족했지요. 기존 스펙과 업그레이드 스펙은 다음과 같습니다.

- CPU: Intel N100
CPU는 홈서버용으로는 충분합니다. 물론 4K 미디어까지 돌리려면 빡세겠지만 제가 그런 걸 돌릴 생각이 없고, 아직까지는 FHD 트랜스코딩만으로도 충분하잖아요?
- RAM: 8GB → 32GB(?!)
N100은 16GB, 3200Mhz RAM까지 지원한다고 공식적인 스펙시트에 나와있습니다. 하지만 찾아본 결과 32GB까지 인식 가능하다는 글이 나와있더군요. 과감하게 32GB로 가봅니다. 물론 미니PC이다보니 데스크탑용 DIMMDual In-line Memory Module이 아닌 노트북용 SO-DIMMSmall Outline Dual In-line Memory Module을 사용해야합니다.
- SSD: 256GB → 1TB
용량은 다다익선입니다. 이상 끝

## Re:build

firebat AK2 를 한번 뜯어봅시다. 뒤쪽 스위치를 당기면 상판은 쉽게 떨어집니다. 상판을 들고나면 SATA 케이블과 함께 2.5인치 하드디스크를 장착할 수 있는 브라캣이 있습니다. 이런 게 있는 줄 알았으면 2.5인치 하드디스크도 준비할 걸 그랬네요. 해당 브라캣까지 제거해보면 RAM이 보입니다. 아무래도 저가 제품이기 때문에 RAM이 어느 회사 제품인지는 잘 모르겠군요. 해당 RAM을 분리하고 은색 플라스틱 판도 분리해준 뒤, 메인보드를 고정한 나사까지 분리해봅시다. 저 은색 플라스틱 판을 분리하기 위해서는 드라이버 중 긴 드라이버가 필요하니 참고하세요.

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/04-batch_2.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/05-batch_3.webp)

미니PC의 경우 Wi-Fi를 지원하기 때문에 Wi-Fi 안테나가 연결되어 있거든요. 잘못 잡아당기면 안테나가 부러지거나 안테나를 잇는 선이 끊어지기 때문에 메인보드를 조심히 분리해야합니다. 선까지 제거할 필요없이 조심하게 분리해주면 다음과 같이 메인보드를 확인할 수 있습니다. 좌측으로는 CPU 냉각 팬이 있고 우측에는 M.2 슬롯을 사용하는 SSD를 확인할 수 있습니다. M.2 슬롯의 2280 SSD이지만 SATASerial ATA 방식입니다.

냉각 팬을 고정한 나사를 분리한 뒤 조심스럽게 분리하면 서멀 구리스가 덕지덕지 되어있는 N100 CPU를 확인할 수 있습니다. 해당 서멀 구리스를 제거하고 MX-4를 조심스럽게 발라줍니다. 누구는 X자로 바르고 누구는 당구장 표시(※)로 바른다고 하지만 N100은 작은 CPU다 보니 넘치지만 않게 발라줍시다.

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/06-9.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/07-batch_5.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/08-7.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/09-6-1.webp)

발라주고 냉각 팬을 다시 덮고 조인 뒤에 SSD를 교체해줍니다. 기존 SATA 방식의 256GB SSD를 NVMe 방식의 1TB로 교체한 뒤 동봉된 방열판도 교체해줍니다. 조립은 분해의 역순이니깐(?) 다시 메인보드를 잘 조립해주고 RAM도 RZX 32GB 3200MHz로 교체해줍니다. 2.5인치 SSD 브라캣도, 상판도 잘 조립해서 마무리해줍니다.

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/10-batch_4-2.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/11-10.webp)

## Researching Upgrade...

RAM은 몰라도 SSD를 바꾼 이상 모든 데이터가 초기화되었겠죠? OS부터 다시 설치해줘야합니다. 이번에는 GUI를 가진 우분투가 아닌 우분투 서버를 설치해보려고 합니다. 우분투 서버를 USB 드라이브에 부팅 디스크로 만들어줍니다. Mac에서는 balenaEtcher 라는 애플리케이션을 사용하면 됩니다. 우분투 서버는 GUI가 없기 때문에 용량이 4GB 이하로 작지만 안정적인 설치를 위해 최소 8GB 이상의 용량을 가진 USB 드라이브를 사용하시는 걸 잊지마세요.

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/12-batch_101.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/13-batch_102.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/14-batch_-------------------------------2025-06-28-----------------11.09.06.webp)

이제 설치해줍니다. 설치를 위해서 모니터와 키보드를 연결해줍니다. GUI가 아니니깐 마우스는 필요없어요. firebat에서 제조한 컴퓨터가 UEFI에 접근하기 위해서는 부팅 화면이 뜨자마자 ESC 키를 연타해주면 됩니다. 부팅 순서를 USB 드라이브로 변경하고 저장&나가기를 해주면 우분투 서버 설치 화면으로 넘어가게 됩니다.

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/15-Install1.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/16-Install2.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/17-Install3.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/18-Install4.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/19-Install5.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/20-Install6.webp)

설치하는 화면을 이쁘게 캡쳐하는 방법을 몰라 열심히 찍었어요(...)

1. 언어 선택: Korean 없습니다. 그나마 익숙한 **English**를 선택합니다.
1. 설치 기반을 선택: 고수는 minimized한 것을 선택해서 자기가 원하는대로 설치하겠지만 저는 쪼랩이니깐 **Ubuntu Server**를 선택합니다.
1. 네트워크 선택: eth는 유선 인터넷, wlan은 무선 인터넷입니다. 기존에도 유선으로 사용했기 때문에 **eth**만 선택하고 넘어갑니다.
1. 프록시 선택: 저는 이건 뭔지 몰라서 스킵합니다. 엔터
1. 미러 이미지 선택: 인터넷을 조금 더 찾아보니 조금 더 빠른 곳이 있다고 하는데 저는 속도가 충분히 나왔습니다. 그냥 엔터로 넘어갑니다.
1. 스토리지 선택: 새로 SSD를 설치했으니 **Use an entire disk**를 선택합니다.

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/21-Install7.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/22-Install8.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/23-Install9.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/24-Install10.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/25-Install11.webp)

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/26-Install12.webp)

설치하는 화면을 이쁘게 캡쳐하는 방법을 몰라 열심히 찍었어요222

1. 스토리지 설정: 엔터 엔터
1. 프로필 설정: 서버 이름과 별명, 비밀번호를 입력합니다. 서버 접속할 때 SSH 접속이 중요하니깐 잘 설정해주세요.
1. 우분투 프로: 사용안할거죠? **Skip for now**
1. SSH 설정: 여기서 설치해도 되지만 저는 추후 설치할 예정입니다.
1. 서버 관련 애플리케이션 설치: 마찬가지로 넘어갑니다.
1. 설치 중...

설치를 완료하고 난 뒤 다음 명령어로 패키지를 업데이트해줍니다.

```
sudo apt update # 업데이트할 패키지 확인
sudo apt upgrade # 확인한 패키지를 업데이트
```

그리고 아까 설치하지 못한 openSSH를 설치해줍니다.

```
sudo apt-get install openssh-server # openSSH 설치
sudo systemctl status ssh # 설치한 openSSH 설치 확인
sudo systemctl start ssh # 확인했을 때 status가 active가 아닐 경우 입력
sudo systemctl enable ssh # 재부팅해도 active 상태가 유지되도록 설정
```

마지막으로 우분투의 방화벽을 설정하고 방화벽에서 SSH를 허용합니다.

```
sudo ufw enable # 우분투의 방화벽을 활성화해줍니다.
sudo ufw allow ssh # 방화벽에서 SSH를 허용합니다. 일반적으로는 22포트가 열립니다.

```

## Upgrade Complete!

SSH 설정까지 마무리하면 이제 홈서버와 연결한 모니터와 키보드를 제거하고 기존에 사용하던 PC에서 접속해줍니다. 그게 편하니깐요. 맥북에서는 터미널 또는 iTerm 을 사용하면 됩니다. 터미널에서 홈서버로 접속하려면 다음과 같이 입력하면 됩니다.

```
ssh YOUR-NICKNAME@YOUR-SERVER_ID

# YOUR-NICKNAME은 우분투 설치 시 입력한 닉네임
# YOUR-SERVER_ID는 홈서버의 "내부 IP 주소"
```

홈서버를 업그레이드하였으니 홈서버에서 잘 인식하고 있는지 확인해줍니다.

```
free -h # 현재 RAM과 같은 메모리 현황을 확인합니다.
lsblk # 설정된 디스크와 용량 현황을 확인합니다.
df -h # "현재 설치된" 디렉토리 구조를 확인합니다.
```

![Re:Server - 01. Upgrade Complete](/assets/ghost/re-server-01/27--------------------------------2025-06-28--------------2.37.54.png)

뿌-듯

이렇게 홈서버 업그레이드를 완료했습니다. 그러면 다음에는 Docker를 설치하고 홈서버 인프라를 다시 설치하는 작업을 정리한 포스트로 찾아뵙겠습니다. 긴 글 읽어주셔서 감사합니다.
