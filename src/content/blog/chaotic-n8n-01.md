---
title: "우당탕탕 N8N - (1) Credentials from Google"
meta_title: "우당탕탕 N8N - (1) Credentials from Google — Yongjin"
description: "N8N을 사용하면 필수적으로 사용하게 되는 구글 서비스 노드를 이용하기 위한 Credentials를 설정하는 방법에 대한 글입니다."
date: 2025-06-21T00:00:00+09:00
image: "/images/ghost/chaotic-n8n-01/01-feature-2.webp"
author: "Yongjin"
categories: ["Tech"]
tags: ["Tech", "n8n"]
draft: false
source: "ghost"
original_url: "https://www.yongjin.dev/chaotic-n8n-01/"
---
## 목차

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/01-feature-2.webp)

안녕하십니까. 서비스기획자 용진입니다.

N8N을 사용하다보면 구글 서비스를 많이 하게 됩니다. 구글 드라이브에 저장된 파일을 읽는다던가, 구글 스프레드시트에 내용을 정리한다던가 말이죠. 그렇다면 구글 서비스를 읽고 쓰게 하기 위해서는 구글 API와 연결을 해야합니다. 그런데 보통 구글 API는 공돌이 회사답게 개발자들이 사용하기 편하게 만들어져있죠. 그래서 일반인인 제 경험을 통해 다른 분들도 N8N에서 구글 연결을 쉽게 할 수 있도록 알려드리고자합니다. 좋죠? 좋잖아. 좋으면 댓글 좀 써줘

## N8N에서 구글 노드를 써야할 때

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/02-1-2.webp)

해당 워크플로는 다시 등장할겁니다. 제 피같은 8,000원을 순식간에 태워버렸거든요.

제 피같은 돈 8,000원을 가져간 N8N 워크플로입니다. (이건 후일 다시 이야기하도록 하죠.) 해당 워크플로 실행을 위해 구글 시트의 사용 권한(읽기, 쓰기)가 필요합니다. 해당 노드를 클릭했을 때 "**Credential to connect with"에 **아무것도 없으실테니 해당 드롭다운을 클릭하시고 Create new credential을 선택합시다. 그러면 다음 화면이 표시되면서 OAuth2(recommand)와 서비스 계정 중 하나를 선택하라고 할 겁니다. 우리는 OAuth2로 진행하도록 하죠.

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/03-2-2.webp)

선택 창 위에 있는 Open docs로 도움을 받을 수 있지만 해당 문서를 끝까지 따라했을 때 안되시는 분들은 오늘 글을 끝까지 읽으시면 도움이 되실겁니다.

### 잠깐, OAuth가 뭔가요?

OAuthOpen Authorization는 비밀번호를 노출하지 않고도 제3자 앱이 내 정보를 안전하게 사용할 수 있게 해주는 표준 프로토콜입니다. 예를 들어, 어떤 앱이 내 Google Drive 파일을 사용하려 할 때, 내 구글 비밀번호를 알려주는 대신 “이 앱이 Drive 읽기 권한만 가지도록” 허용하는 방식인거죠. 여기서 중요한 것은 OAuth는 로그인을 하는 것이 아닌 권한을 준다는 점입니다. 그렇기 때문에 로그인을 할 필요가 없어서 서로 ID/PW를 보관해야하는 일이 없다는 장점이 있죠. 그럼 다시 API를 얻으러 가보죠.

## Google에서 API 권한 얻기

### 콘솔 로그인부터 API 사용 신청하기까지

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/04-3-1-1.webp)

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/05-3-2.webp)

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/06-3-3.webp)

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/07-3-4.webp)

구글 클라우드 콘솔에 접속해서 프로젝트를 만들고 API 추가까지 하는 법을 캡쳐하였으니 보면서 하세요.

구글은 워낙 서비스가 많고 그에 따라 제공하는 API도 많기 때문에 통합 관리를 위해 구글 클라우드 콘솔([https://cloud.google.com/](https://cloud.google.com/?ref=yongjin.dev))을 제공합니다. 우리도 당연히 여기서 사용 권한을 획득해야하기 때문에 해당 링크로 들어가서 프로젝트까지 만들어줍니다. 프로젝트까지 다 만들었으면 API 및 서비스라는 메뉴로 들어갑니다. 상단의 검색 영역을 통해 검색해도 되고 왼쪽의 라이브러리 메뉴를 통해서 필요한 API 서비스를 확인, 사용을 선택해서 사용하도록 합시다. N8N을 통해서 다양한 걸 해보고 싶으신 분들도 있을테니 사용 신청할만한 API 서비스를 알려드리면 다음과 같습니다.

- 필수 사용

  - Google Drive: 이거 사용안하면 구글 드라이브 안 파일이 안열립니다...

- 선택

  - Google Calendar
  - Google People
  - Google Mail
  - Google Sheets
  - Google Task
  - Google Docs
  - Google Slide

### OAuth2 신청하기

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/08-4-2.webp)

API 및 서비스에서 벗어나도 당황하지 않고 시작하기를 눌러 만들어줍니다.

열심히 사용 신청하셨다면 다음으로 해야할 것은 OAuth2를 사용할 클라이언트를 만드는 것입니다. 처음 하시는 분들은 OAuth 동의 화면을 선택한 뒤에 해당 화면에서 시작하기를 눌러 시키는대로 만들어주시면 됩니다. 다 만들었으면 브랜딩으로 들어가서 승인된 도메인에 n8n을 사용하고 있는 도메인을 넣어주세요. 셀프 호스팅을 하고 있다면 서브도메인을 빼고 넣으면 되고 n8n 클라우드를 사용하고 있다면 n8n.cloud을 넣어주면 됩니다.

자, 이제 클라이언트를 만들어줍니다. OAuth 만들 때 이미 API 및 서비스에서 벗어나 Google 인증 플랫폼으로 들어와있을겁니다. 왼쪽 메뉴에서 클라이언트를 선택한 뒤 클라이언트를 만들어줍니다. OAuth 클라이언트 ID 만들기에서는 다음과 같이 진행해주세요.

1. 애플리케이션 유형: 웹 애플리케이션
1. 이름: 알기 쉽게 마음대로
1. 승인된 리디렉션 URL: 아까 우리 Create new credential 눌렀을 때 들어갔던
Google Sheets OAuth2 API 모달 기억하십니까? 거기에 보시면 OAuth Redirect URL이 있습니다. 그걸 여기에 넣어주세요.

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/09-5-2.webp)

이 세 개만 잘 입력하시면 됩니다. 그러면 클라이언트 ID랑 비밀번호가 만들어지고 이걸 Google Sheets OAuth2 API 모달의 Client ID와 Client Secret에 넣어주고 Sign in with google 버튼을 누르면 완료...가 안되죠? ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ 오류 403: access_denied 뜨죠? ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ

### 추가 권한 설정(Feat. 나도 N8N 문서한테 낚였어)

여기까지가 N8N 공식 문서에서 제공한 OAuth였습니다. 저도 이 부분에서 헤맸죠. 그럼 이 인간들이 안 알려준 게 뭘까요? 아까 Google 인증 플랫폼으로 다시 돌아와서 대상을 눌러줍니다. 방법은 두 가지입니다. 테스트 단계 하단의 앱 게시 버튼을 선택해서 프로덕션 단계로 전환하거나 하단의 테스트 계정에 본인 계정을 추가하는 방법이 있습니다. 저는 귀찮아서 앱 게시로 했습니다. 그리고서 다시 Sign in with google을 눌러주시면 짜잔. 완료!

![우당탕탕 N8N - (1) Credentials from Google](/images/ghost/chaotic-n8n-01/10-6-3.webp)

해당 부분에서 "앱 개시" 버튼을 눌러주면 프로덕션 단계가 됩니다. 보통 SW 개발에서 모든 개발이 완료된 뒤에 실 사용할 수 있게 배포하는 것을 Production 이라고 하죠.

## 결론

이렇게 간단하게 N8N 사용에 필수적인 구글 서비스를 연결하는 법을 해보았습니다. 저도 좀좀따리로 하고 있는데 참 배울 게 많다는 생각이 드네요(...) 다음에는 뭘로 찾아오게 될까요?
