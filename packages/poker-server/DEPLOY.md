# 포커 배포 가이드 (Render 무료 + Neon Postgres + Vercel)

웹 클라이언트(`poker-web`)는 이미 Vercel(`https://ensnif-poker-web.vercel.app`)에 배포돼 있지만,
백엔드(`poker-server`)가 없어 로그인/플레이가 동작하지 않는다. 이 문서는 백엔드를 Render에 올리고
웹을 백엔드와 연결하는 순서를 정리한다.

아키텍처: **Vercel(정적 웹) → Render(Express+Socket.IO 상시 구동) → Neon(Postgres)**

> 무료 티어 주의
> - Render 무료 웹 서비스는 **15분 무요청 시 슬립** → 첫 접속에 콜드스타트(~30~50초). 깨어나면 정상.
> - 서버 재시작/슬립 시 **진행 중이던 핸드와 테이블 착석 상태는 사라짐**(인메모리). 단, **칩 잔고는 Neon Postgres에 영속**되므로 다시 로그인·착석하면 된다.
> - Neon은 **영구 무료**(미사용 시 자동 일시정지, 접속 시 자동 재개). Render 자체 무료 Postgres는 90일 후 삭제되니 쓰지 말 것.

---

## 1. Neon Postgres 생성 (사용자 직접)

1. https://neon.tech 가입 → **New Project** 생성(리전은 `Asia Pacific (Singapore)` 권장).
2. 생성되면 **Connection string**을 복사. 형태:
   ```
   postgresql://<user>:<password>@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/<db>?sslmode=require
   ```
   - `sslmode=require`가 포함돼 있어야 한다(서버가 이걸 보고 TLS를 켠다).
   - 스키마(`users`, `ledger` 테이블)는 서버가 기동 시 `db.init()`으로 **자동 생성**하므로 직접 만들 필요 없다.

---

## 2. Render에 백엔드 배포 (사용자 직접)

저장소에 `render.yaml`(블루프린트)과 `packages/poker-server/Dockerfile`이 이미 들어 있다.

### 방법 A — Blueprint (권장)
1. https://dashboard.render.com → **New → Blueprint** → 이 GitHub 저장소 선택.
2. Render가 `render.yaml`을 읽어 `ensnif-poker-server`(Docker, free, 싱가포르) 서비스를 만든다.
3. 배포 전/후 **Environment** 탭에서 `DATABASE_URL`에 1번 Neon 연결 문자열을 붙여넣고 저장.
   - `JWT_SECRET`은 `generateValue`로 자동 생성됨. `CLIENT_ORIGIN`은 `https://ensnif-poker-web.vercel.app`로 미리 들어가 있음.
4. 첫 배포 완료 후 서비스 URL 확인: 예) `https://ensnif-poker-server.onrender.com`
5. Health 확인:
   ```
   curl https://ensnif-poker-server.onrender.com/health   # → {"ok":true}
   ```

### 방법 B — 수동(블루프린트 대신)
New → **Web Service** → 저장소 선택 → 다음 설정:
- Runtime: **Docker**
- Dockerfile Path: `packages/poker-server/Dockerfile`
- Docker Build Context Directory: `.` (저장소 루트 — 중요)
- Health Check Path: `/health`
- Instance Type: **Free**
- Environment Variables:
  | Key | Value |
  |-----|-------|
  | `DATABASE_URL` | (Neon 연결 문자열) |
  | `JWT_SECRET` | (임의의 긴 랜덤 문자열) |
  | `CLIENT_ORIGIN` | `https://ensnif-poker-web.vercel.app` |
  | `STARTING_CHIPS` | `10000` |
  | `TURN_SECONDS` | `30` |
  > `PORT`는 설정하지 말 것 — Render가 자동 주입하고 서버는 `process.env.PORT`를 읽는다.

---

## 3. Vercel 웹을 백엔드에 연결 (사용자 직접)

`poker-web`은 Vite라 `VITE_*` 값이 **빌드 타임에 인라인**된다. 환경변수를 바꾸면 **재빌드(재배포)** 해야 적용된다.

1. Vercel → `ensnif-poker-web` 프로젝트 → **Settings → Environment Variables** (Production):
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://ensnif-poker-server.onrender.com/api` |
   | `VITE_SOCKET_URL` | `https://ensnif-poker-server.onrender.com` |
   (실제 Render 도메인으로 교체)
2. **Deployments → 최신 빌드 → Redeploy**(또는 새 커밋 푸시)로 재배포.
3. 끝나면 `https://ensnif-poker-web.vercel.app/login`에서 회원가입 → 로비 → 착석 → 플레이까지 동작.

---

## 4. CORS / 도메인 정리

- 서버 `CLIENT_ORIGIN`(Render env)에 **웹 도메인이 정확히** 들어가야 소켓/REST가 허용된다.
  커스텀 도메인이나 Vercel 프리뷰 URL도 쓰려면 콤마로 추가: `https://a.com,https://b.vercel.app`
- 웹 `VITE_SOCKET_URL`/`VITE_API_URL`은 **서버 도메인**을, 서버 `CLIENT_ORIGIN`은 **웹 도메인**을 가리킨다(서로 반대 방향).

---

## 로컬에서 똑같이 돌려보기

```bash
# 1) 로컬 Postgres (Docker)
docker run -d --name poker-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=poker -p 5432:5432 postgres:16-alpine

# 2) 서버 (packages/poker-server/.env 의 DATABASE_URL 사용)
pnpm dev:poker-server          # http://localhost:4000

# 3) 웹 (별도 터미널) — dev 프록시가 /api, /socket.io 를 4000으로 넘김
pnpm dev:poker-web             # http://localhost:5174
```

## 동작 확인용 빠른 점검

```bash
curl https://<server>/health                         # {"ok":true}
curl -X POST https://<server>/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"pass1234"}'     # {token, user:{chips:10000}}
```
