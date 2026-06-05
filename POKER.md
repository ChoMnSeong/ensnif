# ♠ Hold'em — 가상 코인 텍사스 홀덤

실시간 멀티플레이 No-Limit 텍사스 홀덤 웹앱. 계정/뱅크롤은 서버 DB에 영구 저장되고,
게임 상태는 **서버 권한(server-authoritative)** 으로 진행됩니다.

## 패키지

| 패키지 | 설명 | 스택 |
|---|---|---|
| `@ensnif/poker-engine` | 순수 TS 포커 엔진(덱·핸드평가·홀덤 상태머신) + 클라/서버 공유 프로토콜 타입 | TypeScript, Vitest |
| `poker-server` | 실시간 게임 서버 (인증·DB·테이블 루프) | Express + Socket.IO, JWT, bcryptjs, `node:sqlite` |
| `poker-web` | 웹 클라이언트 (로비·테이블 UI) | React 19 + Vite + Emotion + `@ensnif/design-system`(minimal/dark/green) |

엔진은 빌드 단계 없이 **TS 소스 그대로** 서버(tsx)와 클라(Vite)가 임포트합니다.

## 실행 방법

```bash
# 1) 의존성 설치 (저장소 루트에서)
pnpm install

# 2) 디자인 시스템 빌드 (클라이언트가 dist를 사용)
pnpm build:design-system

# 3) 서버 환경설정
cp packages/poker-server/.env.example packages/poker-server/.env
#   필요 시 .env의 JWT_SECRET / 포트 등을 수정

# 4) 게임 서버 실행 (터미널 A)  → http://localhost:4000
pnpm dev:poker-server

# 5) 웹 클라이언트 실행 (터미널 B) → http://localhost:5174
pnpm dev:poker-web
```

브라우저에서 `http://localhost:5174` 접속 → 회원가입(가입 시 10,000 칩 지급) → 로비에서 테이블 선택 →
바이인 후 착석. 두 명 이상 앉으면 자동으로 핸드가 시작됩니다.

> 멀티플레이 테스트는 시크릿 창이나 다른 브라우저로 두 번째 계정을 만들어 같은 테이블에 앉으면 됩니다.

## 환경 변수 (`packages/poker-server/.env`)

| 변수 | 기본값 | 설명 |
|---|---|---|
| `PORT` | `4000` | 서버 포트 |
| `JWT_SECRET` | `dev-secret-change-me` | JWT 서명 키 (**운영 시 반드시 변경**) |
| `CLIENT_ORIGIN` | `http://localhost:5174` | 허용 CORS 오리진(쉼표 구분) |
| `DATABASE_PATH` | `./data/poker.db` | SQLite 파일 경로 |
| `STARTING_CHIPS` | `10000` | 신규 계정 지급 칩 |
| `TURN_SECONDS` | `30` | 액션 제한시간(초). 초과 시 자동 체크/폴드 |

개발은 `node:sqlite`(Node 내장)로 외부 DB 없이 즉시 동작합니다.
운영 확장 시 `packages/poker-server/src/db.ts`의 저장 계층만 Postgres(Neon 등)로 교체하면 됩니다.

## 테스트

```bash
pnpm test:poker-engine   # 핸드 평가 + 홀덤 상태머신 단위 테스트(Vitest)
```

## 게임 규칙/구현 메모

- No-Limit 텍사스 홀덤, 캐시 게임. 프리셋 테이블: 마이크로(5/10), 헤즈업(10/20), 로우(25/50), 하이롤러(100/200).
- 버튼 로테이션, 헤즈업 버튼=SB 규칙, 빅블라인드 옵션, 미니멈 레이즈, 사이드팟, 스플릿팟 홀수칩 분배, 올인 런아웃 모두 구현.
- 바이인 시 뱅크롤→테이블 스택으로 이동(원장 기록), 퇴장/캐시아웃 시 복귀 → 칩 총량 항상 보존.
- 연결 끊김 시 45초 그레이스 후 자동 캐시아웃, 차례면 자동 폴드/체크.

### 알려진 한계 (MVP)
- 최소 레이즈 미만의 올인은, 이미 액션한 플레이어의 재레이즈 권리를 엄밀히 제한하지 않습니다(칩 정산은 정확).
- 인메모리 테이블 상태이므로 서버 크래시 중 진행 핸드의 인플레이 칩은 복구되지 않습니다(뱅크롤은 안전).
- 관전 전용 입장은 미지원(착석 시 입장).
