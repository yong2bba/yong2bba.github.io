# Context

## Source

- Template: https://github.com/zeon-studio/astroplate
- Target repository: https://github.com/yong2bba/yong2bba.github.io
- Target Pages URL: https://yong2bba.github.io/

## Accepted Direction

- 현재 Astroplate `/blog` 화면을 홈으로 사용한다.
- 높이·여백·카드 레이아웃은 건드리지 않는다.
- 제품 소개형 기존 `/`는 사용하지 않는다.
- 콘텐츠·브랜딩·언어·메타데이터·기능만 정리한다.

## Technical Context

- Astro 7, Tailwind CSS 4, React 19, pnpm 11
- GitHub Pages 정적 배포
- Node 22 이상 필요
- RSS: `@astrojs/rss`
- TOC: 기존 `remark-toc` + `remark-collapse`
- AI: 기존 `llms.txt` 계열 + Declarative WebMCP 검색 폼

## Constraints

- 공개 저장소에 비밀값을 저장하지 않는다.
- WebMCP 미지원 브라우저에서도 검색이 정상 동작해야 한다.
- 실제 콘텐츠가 없는 상태에서 데모 글을 실제 글처럼 공개하지 않는다.
