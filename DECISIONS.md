# Decisions

## 2026-08-10 — GitHub 사용자 사이트 저장소

**Status:** accepted

**Decision:** `yong2bba/yong2bba.github.io` 공개 저장소와 GitHub Pages를 사용한다.

**Reason:** 루트 경로 배포가 가능하고 별도 `base` 경로가 필요 없다.

## 2026-08-10 — `/blog` 레이아웃을 홈으로 사용

**Status:** accepted

**Decision:** 기존 `/blog`의 높이·여백·카드 배치를 유지한 채 `/`에서 렌더링한다.

**Tradeoffs:** 개인 소개형 히어로는 없지만 즉시 글 탐색이 가능하다.

## 2026-08-10 — WebMCP는 점진적 향상

**Status:** accepted

**Decision:** 검색을 표준 HTML form으로 유지하고 Declarative WebMCP 속성만 추가한다.

**Reason:** 실험 표준이 일반 검색을 차단하지 않아야 한다.

## 2026-08-10 — 샘플 콘텐츠 제거

**Status:** accepted

**Decision:** Astroplate의 Lorem ipsum·샘플 작성자·샘플 SNS를 공개하지 않는다.
