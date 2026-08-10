---
name: Yongjin Blog
version: 0.1.0
description: Astroplate blog-list layout preserved for a Korean personal blog
colors:
  mode: existing-astroplate-light-dark
  primary: existing-theme-primary
  background: existing-theme-background
typography:
  family: existing-theme-font
  language: ko
spacing:
  policy: preserve-existing-blog-layout
---

# Design Contract

## Direction

Astroplate `/blog`의 현재 시각 구조를 기준으로 삼는다. 높이, 여백, 카드 그리드, 사이드바, 페이지네이션을 재설계하지 않는다.

## Allowed Changes

- 한국어 콘텐츠와 라벨
- 블로그 로고·제목·소개
- 메타데이터와 접근성 속성
- RSS·TOC·WebMCP처럼 시각 구조를 바꾸지 않는 기능

## Do

- 이미지가 있는 글과 없는 글을 모두 안전하게 표시한다.
- Semantic HTML과 접근성 이름을 유지한다.
- 라이트·다크 모드를 보존한다.

## Do Not

- 섹션 높이·상하 여백을 임의로 축소하지 않는다.
- 새로운 히어로·Bento·그라데이션을 추가하지 않는다.
- 샘플·플레이스홀더 콘텐츠를 공개하지 않는다.
