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

## 2026-08-10 — Homebox 실제 글 12개 우선 이관

**Status:** accepted

**Decision:** 현재 `yongjin.dev`에 존재하는 Markdown 12개와 Ghost 자산 221개를 우선 공개한다. 옛 `yongjins.dev`에서 본문을 확보하지 못한 11개는 포함하지 않는다.

**Preservation:** 제목·설명·날짜·태그·본문·코드·이미지를 보존한다. 임시 이전 안내문은 제거하고, 함께 이관되는 글을 가리키는 내부 링크 5개만 새 `/blog/{slug}` 경로로 바꾼다.
