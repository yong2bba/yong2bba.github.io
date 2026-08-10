# Log

## 2026-08-10

- Astroplate 템플릿으로 `yong2bba.github.io` 저장소를 생성했다.
- `/blog` 디자인 유지, `/` 홈 연결, RSS·TOC·Declarative WebMCP 도입 결정을 기록했다.
- 한국어 브랜딩·콘텐츠·날짜·404와 canonical·Open Graph·JSON-LD를 적용했다.
- 검색을 표준 form과 Declarative WebMCP로 노출하고 정규식 특수문자 오류·포커스 경고를 수정했다.
- 공유 링크의 `/blog` 누락을 실제 브라우저 QA에서 찾아 수정했다.
- 취약 의존성 4건을 패치 버전으로 고정하고 사용하지 않는 Astro 6 전용 GTM 패키지를 제거했다.
- build/check/정적 검증/peer/audit와 데스크톱·모바일 브라우저 QA를 통과했다.
- 공개 검증에서 CI의 UTC 시간대로 날짜가 하루 당겨지는 문제를 발견해 `Asia/Seoul` 표시 시간대를 고정했다.
- PR #1·#2를 병합하고 GitHub Pages Actions 배포 및 공개 모바일 회귀검증을 완료했다.
- Workboard `t_5a6823fc`에 Alpha(default) 담당, 검증 증거, accepted 결정, blockers 없음으로 완료 기록했다.
- Homebox `yongjin.dev`의 실제 Markdown 12개를 Astro 콘텐츠로 변환하고 시험 글을 제거했다.
- Ghost 자산 221개를 SHA-256 동일하게 복사했고 본문 자산 참조 83개·누락 0개를 확인했다.
- 임시 이전 안내문만 제거하고 함께 이관되는 글의 내부 링크 5개를 새 경로로 변경했다.
- 이관 검증을 `verify-build.mjs`에 추가하고 Workboard `t_7d6fee45`에 작업을 등록했다.
- Astroplate 이미지 glob에 WebP를 추가해 이관 글 대표 이미지 최적화 경고를 제거했다.
- 카드 요약에서 Markdown을 먼저 제거한 뒤 자르도록 수정해 390px 가로 넘침을 해결했다.
- 32페이지 build, check 0/0/0, 정적 검증 20/20과 데스크톱·390px 브라우저 QA를 통과했다.
