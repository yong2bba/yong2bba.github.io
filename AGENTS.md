# Agent Instructions

## Read First

1. AGENTS.md
2. HANDOFF.md
3. CONTEXT.md
4. TASKS.md
5. PRODUCT.md
6. PLAN.md
7. DECISIONS.md
8. docs/specs/

## Savepoint Rule

긴 작업·위험한 변경·검증 전후에 HANDOFF.md, TASKS.md, LOG.md를 갱신한다.

## Astro Rules

- Astro 변경 전 공식 문서의 현재 동작을 확인한다.
- 기존 템플릿의 콘텐츠 파서·레이아웃·설정 패턴을 우선 재사용한다.
- `/blog`의 높이·여백·카드 레이아웃은 사용자 승인 없이 변경하지 않는다.

## Development Rules

- 최소 변경으로 기존 기능을 재사용한다.
- 샘플 콘텐츠와 비밀값을 공개하지 않는다.
- WebMCP는 점진적 향상이어야 한다.
- 에이전트 커밋은 `yongyong <yong2bba@gmail.com>`을 사용한다.

## Testing and Validation

- `pnpm build`
- `pnpm check`
- 정적 산출물에서 RSS, canonical, JSON-LD, TOC, `lang=ko`, WebMCP 속성 검사
- 실제 브라우저에서 데스크톱·모바일·링크·가로 넘침 확인

## Dependency Policy

필요한 공식 패키지만 추가한다. 현재 범위에서는 `@astrojs/rss`만 허용한다.

## Safety Constraints

- `.env`, 토큰, 키, 자격 증명을 커밋하지 않는다.
- 실제 배포·병합은 검증 통과 후에만 한다.
- 삭제·공개범위 변경·도메인 변경은 명시적 범위 안에서만 한다.

## Definition of Done

로컬 검증, PR CI, main 배포, 실제 Pages URL 회귀검증이 모두 통과하고 증거가 기록돼야 한다.
