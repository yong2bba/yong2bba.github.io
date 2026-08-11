# Log

## 2026-08-11

- P1에서 모바일 checkbox/label 메뉴를 44×44px native button으로 교체하고 `aria-expanded/controls`와 Escape 포커스 복귀를 적용했다.
- 검색 dialog에 44px 닫기 버튼, 초기 포커스, 동적 focus trap, Escape·Ctrl+K trigger 복귀를 적용했다.
- 정적 접근성 계약을 RED→GREEN으로 확인하고 390×844 실제 Tab·Shift+Tab·Escape·Ctrl+K 키보드 흐름을 PASS했다.
- AccessLint에서 P1 신규 위반 0을 확인했다. 소개 페이지 `h1` 1건은 공개 baseline과 동일한 기존 항목이다.
- 독립 QA 1차에서 숨은 submit 포커스와 Cmd/Ctrl+K 비토글을 병합 차단으로 수용했다. 숨은 submit을 제거하고 shortcut을 toggle로 변경한 뒤 Shift+Tab→44px 닫기 버튼, 두 번째 Ctrl+K→닫기·trigger 복귀를 재현 PASS했다.
- v2 독립 QA 산출물에서 숨은 submit 0, 메뉴 Enter·Space, 검색 정·역방향 trap, Escape·shortcut toggle, 390×844 overflow·console 오류 0을 확인해 Alpha exact PASS로 판정했다.
- 검색 `서버` 결과가 60~100px 썸네일 8개에 원본 12.32MiB를 전송하는 P0 결함을 재현했다.
- `SearchResult.tsx`를 기존 반응형 이미지 manifest에 연결해 AVIF 우선·WebP fallback·lazy/async 썸네일을 제공했다.
- `verify:build`에 검색 번들의 AVIF/WebP·480px·lazy 계약을 추가하고 RED→GREEN을 확인했다.
- 390×844 콜드 검색에서 결과 8개·AVIF 8개·78.0KiB, 원본 요청 0, broken image 0, overflow 0을 확인했다.
- 검색 이미지 전송량은 12.32MiB→78.0KiB로 99.38% 감소했고 시각 QA를 PASS했다.
- 독립 QA에서 격리 clone·390×844 콜드 검색 77.77KiB·원본 요청 0을 재현하고 exact PASS했다.
- PR #11의 `Build and verify`가 통과해 squash 병합했다.
- main Pages run `31460640868`의 build·deploy가 성공했다.
- 공개 390×844 콜드 `서버` 검색에서 AVIF 8/8·77,647바이트·원본 요청 0·broken 0·overflow 0과 시각 QA PASS를 확인했다.
- 모바일 Lighthouse에서 홈 Performance 64, LCP 31.3초, 전송량 6.23MB를 확인했다.
- 첫 대표 PNG가 5.55MB이며 `/assets/` 경로에서 Astro 최적화를 우회하는 것을 원인으로 확인했다.
- 사용자 승인으로 원본을 보존하고 대표 이미지만 Sharp 파생 AVIF/WebP로 제공하는 작업을 시작했다.
- 대표 이미지 12개에서 480·768·1200px AVIF/WebP 72개를 빌드 시 생성하고 manifest로 연결했다.
- 목록과 글 hero에 picture/srcset을 적용하고 첫 LCP 이미지만 eager/high, 이후 이미지는 lazy/auto로 분리했다.
- 로컬 Lighthouse에서 Performance 88, LCP 3.2초, 총 전송 629KB, 이미지 36KB를 확인했다. 모바일 overflow는 0이었다.
- 독립 QA에서 원본 221개 SHA-256 집계 동일, AVIF 36개·WebP 36개, 26개 페이지 로딩 우선순위 계약을 확인하고 PASS했다.
- PR #10을 열었고 첫 `Build and verify` CI run `31457146401`이 통과했다.
- PR #10을 squash 병합했고 main Pages run `31457648762`의 build·deploy가 통과했다.
- 공개 Lighthouse 3회 중앙값은 Performance 99, LCP 1.505초, 총 625,723바이트, 이미지 34,979바이트, CLS 0.052였다.
- Cloudflare Browser Run(Kitesurf) 390×844에서 한글·이미지·비율·헤더·카드 레이아웃을 시각 PASS했다.
- 본문·UI를 Noto Sans KR, 영문 로고를 Space Grotesk 600, 코드 블록을 Nanum Gothic Coding으로 변경했다.
- Astro Google provider의 `korean`·`latin` subset을 명시하고 Heebo·Signika 참조를 제거했다.
- `pnpm check`, `pnpm build`, `verify:build`, `verify:migration`을 통과했다.
- Chrome 1440×1000·390×844에서 가로 overflow 0, broken image 0, 실제 코드 3개에 Nanum Gothic Coding 적용을 확인했다.
- PR #9를 생성했고 `Build and verify`가 42초에 PASS했다. PR deploy job은 의도대로 skip됐다.
- 사용자가 PR #9 병합을 승인했다.
- PR #9를 squash 병합했고 main Pages run `31451539767`의 build·deploy가 성공했다.
- 공개 HTML에서 새 폰트 3종과 기존 폰트 제거를 확인하고 Kitesurf에서 한글·이미지·레이아웃을 PASS로 재검증했다.

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
