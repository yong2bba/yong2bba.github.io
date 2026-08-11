---
status: in_progress
updated: 2026-08-11
summary: "Google Fonts 기반 Noto Sans KR·Space Grotesk·Nanum Gothic Coding 적용 및 로컬 검증 완료"
current_focus: "폰트 변경 PR 생성과 CI 검증"
next_step: "브랜치 커밋·PR 생성 후 CI 결과 확인"
blockers: []
---

# Handoff

## Last Work

- 본문·UI를 Noto Sans KR 400/500/600/700, 영문 로고를 Space Grotesk 600, 코드 블록을 Nanum Gothic Coding 400/700으로 변경했다.
- Astro Google font provider에 한글·라틴 subset을 명시하고 기존 Heebo·Signika 의존성을 제거했다.
- 1440px·390px 홈과 코드 블록을 Chrome에서 검증해 폰트 로딩, 깨진 이미지 0, 가로 overflow 0을 확인했다.
- Homebox 복구본의 Markdown 12개를 기존 slug·날짜·태그·본문을 보존해 `src/content/blog`로 이전했다.
- 관련 자산 221개를 `public/assets/ghost`로 이전하고 Ghost 이전 안내문만 제거했다.
- 임시 출시 글 `post-1.md`를 제거했다.
- `/blog` 목록 레이아웃을 `/` 홈으로 연결하고 `/blog`를 정규화했다.
- 한국어 콘텐츠·메타·날짜·404·브랜딩을 적용했다.
- RSS, TOC, canonical, Blog/BlogPosting JSON-LD, Declarative WebMCP 검색을 적용했다.
- 취약 의존성 override와 불필요한 Astro 6 전용 GTM 패키지 제거를 완료했다.

## Current State

- 콘텐츠 이전 PR #4가 main에 병합됐고 GitHub Pages 배포가 성공했다.
- 공개 12개 글·83개 참조 자산과 데스크톱·모바일·검색·TOC를 재검증했다.
- 콘텐츠 본문 12/12 exact 대응, 자산 참조 83/83 존재, 누락 0으로 로컬 검증했다.
- `main`에 PR #1과 날짜 교정 PR #2가 병합됐다.
- `https://yong2bba.github.io/`에 공개됐다.
- 합의한 `/blog`의 높이·여백·목록 구조는 유지됐다.

## Next Safe Action

`feat/google-font-typography`를 커밋·푸시하고 PR CI를 확인한다. 병합·배포는 별도 승인 전 수행하지 않는다.

## Needs User Decision

최종 블로그명, 소개 문구, 커스텀 도메인은 후속 결정 가능하다.

## Blockers

없음.

## Verification

- `pnpm build`: 32 pages built
- `pnpm check`: 0 errors, 0 warnings, 0 hints
- `pnpm verify:build`: 15/15 PASS
- `pnpm verify:migration`: 12 posts, 221 assets, 83 refs, missing 0 PASS
- 브라우저: 1440×1000·390×844 overflow 0, broken image 0, 검색·TOC hash 이동 PASS
- PR #4 `Build and verify`: PASS, main Pages run `31353401751`: build·deploy PASS
- 공개 URL: 홈+12개 글+83개 참조 자산 총 96개 HTTP 200
- `pnpm peers check`: PASS
- `pnpm audit --prod`: No known vulnerabilities found
- `pnpm build`: 11 pages built
- `pnpm check`: 0 errors, 0 warnings, 0 hints
- `pnpm verify:build`: 15/15 PASS
- 브라우저: 데스크톱·390×844 모바일 overflow 없음, 검색·특수문자·TOC·공유 URL·`/blog` 정규화 확인
- 공개 Pages: HTTPS, `lang=ko`, canonical, 2026년 8월 10일 날짜, WebMCP, RSS/llms/sitemap, 모바일 overflow 모두 확인
- Workboard: `t_5a6823fc` — Alpha(default), accepted, blockers 없음
