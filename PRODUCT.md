# Product Brief

## Goal

Astroplate의 현재 `/blog` 목록 레이아웃을 변경하지 않고 Yongjin의 한국어 개인 블로그를 GitHub Pages에 공개한다.

## Target Users

- Yongjin의 글을 읽는 일반 방문자
- RSS 리더 사용자
- 검색·브라우저 자동화를 사용하는 AI 에이전트

## Core Use Cases

- 홈에서 최신 글·카테고리·태그 탐색
- 개별 글 읽기와 목차 이동
- RSS 구독
- 사이트 검색
- 공개 글의 기계 판독 가능한 메타데이터·Markdown 접근

## Non-goals

- Astroplate 레이아웃의 높이·여백·카드 구조 재설계
- 로그인, 댓글 계정, 데이터베이스, 서버 런타임
- WebMCP 의존 기능
- 샘플 콘텐츠를 실제 글처럼 공개

## Success Criteria

- `/`가 기존 `/blog` 목록 화면을 렌더링한다.
- `/blog`는 `/`로 정규화된다.
- 모바일에서 가로 넘침이 없다.
- `lang=ko`, canonical, Open Graph, RSS 자동 발견, JSON-LD가 정확하다.
- RSS와 TOC가 실제 빌드 결과에 존재한다.
- Declarative WebMCP 검색은 점진적 향상이며 일반 검색을 깨뜨리지 않는다.
- GitHub Actions와 실제 Pages 배포가 성공한다.

## User Journeys

1. 방문자는 `/`에서 최신 글을 고른다.
2. 글에서 목차를 사용해 섹션으로 이동한다.
3. RSS 리더는 `/rss.xml`을 자동 발견한다.
4. 지원 브라우저의 에이전트는 검색 폼을 도구로 발견한다.

## Open Questions

- 최종 블로그명·소개 문구·프로필 이미지
- 옮길 실제 기존 글과 썸네일
- 향후 커스텀 도메인
