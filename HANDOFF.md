---
status: in_progress
updated: 2026-08-10
summary: "Homebox yongjin.dev 실제 글 12개와 자산 221개 이관 중"
current_focus: "실제 글 이관 PR·Pages 배포"
next_step: "PR CI 통과 후 병합하고 실제 Pages URL 검증"
blockers: []
---

# Handoff

## Last Work

- Homebox의 실제 Markdown 12개를 Astro 콘텐츠 스키마로 변환했다.
- Ghost 자산 221개를 `public/images/ghost/`에 SHA-256 동일하게 복사했다.
- 임시 시작 글을 제거하고, 이관 글 간 내부 링크 5개를 새 경로로 변경했다.
- 원문 본문 12/12, 자산 참조 83개, 누락 0개를 검증했다.
- WebP 대표 이미지 glob 누락과 모바일 카드 요약 가로 넘침을 수정했다.
- `/blog` 목록 레이아웃을 `/` 홈으로 연결하고 `/blog`를 정규화했다.
- 한국어 콘텐츠·메타·날짜·404·브랜딩을 적용했다.
- RSS, TOC, canonical, Blog/BlogPosting JSON-LD, Declarative WebMCP 검색을 적용했다.
- 취약 의존성 override와 불필요한 Astro 6 전용 GTM 패키지 제거를 완료했다.

## Current State

- `main`에 PR #1과 날짜 교정 PR #2가 병합됐다.
- `https://yong2bba.github.io/`에 공개됐다.
- 합의한 `/blog`의 높이·여백·목록 구조는 유지됐다.

## Next Safe Action

전체 검증과 브라우저 QA를 통과한 뒤 콘텐츠 PR을 병합·배포한다.

## Needs User Decision

최종 블로그명, 소개 문구, 실제 이전 글, 커스텀 도메인은 후속 결정 가능하다.

## Blockers

없음.

## Verification

- `pnpm peers check`: PASS
- `pnpm audit --prod`: No known vulnerabilities found
- `pnpm build`: 32 pages built, image-not-found 0
- `pnpm check`: 0 errors, 0 warnings, 0 hints
- `pnpm verify:build`: 20/20 PASS
- 브라우저: 데스크톱·390×844 모바일 overflow 없음, 대표 글 이미지 15/15, TOC 8개, 내부 링크 200, `Clarity` 검색 결과 3개 확인
- 공개 Pages: HTTPS, `lang=ko`, canonical, 2026년 8월 10일 날짜, WebMCP, RSS/llms/sitemap, 모바일 overflow 모두 확인
- Workboard: `t_5a6823fc` — Alpha(default), accepted, blockers 없음
