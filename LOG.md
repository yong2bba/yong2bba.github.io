# Log

## 2026-08-10

- Homebox `yongjin.dev` 복구본에서 Markdown 12개와 관련 자산 221개를 콘텐츠 브랜치로 이전했다.
- 기존 Ghost 이전 안내문만 제거하고 slug·날짜·태그·코드·링크·이미지·본문을 보존했다.
- 임시 출시 글 `post-1.md`를 제거했으며 기존 레이아웃과 컴포넌트는 변경하지 않았다.
- 소스/타깃 본문 12/12 exact 대응, 자산 참조 83/83 존재, 누락 0을 확인했다.
- build 32페이지, check 진단 0, 정적 검증 15/15와 이전 검증을 통과했다.
- 실제 Chrome에서 1440×1000·390×844 overflow 0, broken image 0, 검색 결과와 TOC hash 이동을 확인했다.
- PR #4 CI를 통과해 main에 병합했고 Pages run `31353401751`의 build·deploy가 성공했다.
- 공개 홈·12개 글·83개 참조 자산 총 96개 HTTP 200과 공개 브라우저 회귀를 확인했다.
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
