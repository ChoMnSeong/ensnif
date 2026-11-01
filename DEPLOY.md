# 배포 가이드 (Deployment)

이 문서는 모노레포의 배포 구조와 개념을 설명합니다. 지금은 **lanime-web을
Docker + nginx로 로컬에서 프로덕션처럼 띄우는 것**까지 구성되어 있고, 나중에
**AWS(Route 53 / CloudFront / S3 / ECS)** 로 옮길 때 그대로 매핑됩니다.

---

## 1. 모노레포 배포 지형도

패키지마다 "종류"가 다르고, 종류에 따라 배포 방법이 갈립니다.

| 패키지 | 종류 | 한 줄 설명 | 배포 방식 |
| --- | --- | --- | --- |
| **lanime-web** | **SSR** | 요청마다 Node가 HTML을 만들어 줌 | **Docker 컨테이너** (이 문서) |
| poker-server | 백엔드 | Express + Socket.IO 실시간 서버 | Docker (Render, `render.yaml`) |
| poker-web | SPA(정적) | 빌드하면 그냥 파일 묶음 | Vercel (또는 S3) |
| lanime-admin-web | SPA(정적) | 〃 | 정적 호스팅 |
| image-to-3d-web | SPA(정적) | 〃 | 정적 호스팅 |
| design-system-docs | SPA(정적) | 〃 | Vercel (`vercel.json`) |
| common / design-system / poker-engine | 라이브러리 | 다른 패키지가 가져다 씀 | 배포 안 함 |
| lanime-native | 앱 | React Native | 스토어 |

> 핵심: **SPA(정적)** 는 "완성된 파일"이라 창고(S3)에 올리면 끝이지만,
> **SSR** 은 "돌아가는 프로그램"이라 **서버(컴퓨트)** 가 필요합니다.

---

## 2. 가장 중요한 개념 — 정적(Static) vs 동적(SSR)

### 정적 호스팅 (S3)

S3는 **파일 창고**입니다. `index.html`, `app.js`, 이미지처럼 **이미 완성된
파일**을 올려두면, 요청이 올 때 그 파일을 **그대로** 돌려줍니다. 서버 로직이
없습니다. 그래서 빠르고, 싸고, 거의 안 죽습니다. → SPA에 딱 맞습니다.

### 서버 렌더링 (lanime-web)

lanime-web은 다릅니다. `packages/lanime-web/server/index.js`(Express)가
`/player/:id` 같은 요청을 받으면 **그 자리에서 React를 HTML로 렌더링**해서
돌려줍니다. 즉 **요청마다 코드가 실행**됩니다.

```
[브라우저] --요청--> [Node 서버가 React 실행 → HTML 생성] --응답--> [브라우저]
```

이건 "완성된 파일"이 아니라 **계속 돌아야 하는 프로그램**입니다.
**그래서 S3에 올릴 수 없습니다.** 항상 켜져 있는 컴퓨트(서버)가 필요하고,
그 컴퓨트를 담는 표준 포장이 바로 **Docker 컨테이너**입니다.

> 결론: lanime-web = **Docker로 포장 → 서버에서 실행**.
> S3/CloudFront는 (나중에) lanime-web의 **정적 에셋(JS/CSS)** 만 가속하는 보조 역할.

---

## 3. 지금 구성된 로컬 Docker 스택

```
                  :80                      :5173
[브라우저] ───────────────▶ [ nginx ] ───────────────▶ [ web (Node SSR) ]
                          리버스 프록시·캐시          lanime-web/server/index.js
```

관련 파일:

| 파일 | 역할 |
| --- | --- |
| `packages/lanime-web/Dockerfile` | lanime-web을 빌드·실행하는 이미지 정의 |
| `nginx.conf` | 앞단 프록시. `/assets/`는 장기 캐시, 나머지는 SSR로 전달 |
| `docker-compose.yml` | `web` + `nginx` 두 컨테이너를 로컬에서 함께 실행 |
| `.dockerignore` | 빌드 컨텍스트에서 불필요한 것 제외(모든 이미지 공통) |

### 3-1. Dockerfile이 멀티스테이지인 이유

빌드에는 무거운 도구(vite, typescript)가 필요하지만, **실제로 배포(ship)하는
이미지에는 그게 필요 없습니다.** 그래서 단계를 나눕니다:

```
base    → node:22-alpine + pnpm(corepack)
deps    → package.json들만 먼저 복사 후 설치   ← 소스만 바뀌면 이 캐시 재사용(빠름)
build   → @ensnif/common(tsc) → lanime-web(vite client+SSR) 빌드 후 dev 의존성 제거
runtime → 실행에 필요한 것(node_modules·dist·server)만 복사 → node server/index.js
```

- **왜 `pnpm --filter lanime-web... build`?** `...`은 "lanime-web과 그 의존성"을
  뜻합니다. lanime-web은 `@ensnif/common`을 쓰는데, common은 `main: dist/index.js`
  라서 **먼저 빌드돼야** 합니다. 이 명령이 의존성 순서대로 common → lanime-web을
  빌드해줍니다.
- **왜 빌드 컨텍스트가 repo 루트(`context: .`)?** pnpm 워크스페이스라
  lockfile·워크스페이스 설정·common 패키지가 모두 루트 기준이기 때문입니다.

### 3-2. nginx의 역할

지금은 모든 요청을 SSR 앱으로 넘기되, 콘텐츠 해시가 붙은 `/assets/*` 파일에는
`Cache-Control: max-age=1년, immutable` 헤더를 붙입니다. **이 "정적 에셋은 길게
캐시"라는 개념이 나중에 CloudFront가 하는 일과 똑같습니다.**

### 3-3. 실행 방법

```bash
# 빌드 + 실행
docker compose up --build

# 브라우저에서
open http://localhost            # nginx(:80) → SSR(:5173)
curl http://localhost/health     # → ok

# 종료
docker compose down
```

> 참고: lanime-web은 실제 동작에 백엔드 API(`env.BASE_URL`)와 프로필 토큰
> 쿠키가 필요합니다. 컨테이너는 정상적으로 뜨고 SSR/헬스체크는 동작하지만,
> 영상 재생 등은 해당 환경변수/백엔드가 연결돼야 끝까지 확인됩니다.

---

## 4. AWS로 옮길 때 (나중에)

좋은 소식: **로컬에서 만든 조각이 AWS 조각에 1:1로 대응**됩니다. 다시 만들 필요
없이 "누가 그 역할을 맡느냐"만 바뀝니다.

```
                         [ Route 53 ]   도메인 → 아래로 연결 (DNS)
                              │
                         [ CloudFront ]  CDN/캐시  ≈ 로컬 nginx의 캐시 역할
                          /          \
              [ S3 버킷 ]            [ ALB ]      라우팅/헬스체크 ≈ 로컬 nginx의 프록시
          정적 에셋(JS/CSS/이미지)        │
                                    [ ECS / App Runner ]
                                     Docker 컨테이너 실행 ≈ 로컬 web 서비스
                                     (이미지는 ECR에 저장)
```

### 4-1. 로컬 ↔ AWS 대응표

| 로컬 (지금) | AWS (나중) | 하는 일 |
| --- | --- | --- |
| `docker compose build` | **ECR** (이미지 저장소) | 빌드한 이미지를 push |
| `web` 컨테이너 | **ECS Fargate** 또는 **App Runner** | 컨테이너를 실제로 실행 |
| `nginx` 프록시 | **ALB** (Application Load Balancer) | 트래픽 라우팅·헬스체크 |
| nginx의 `/assets` 캐시 | **CloudFront (+ S3)** | 정적 에셋 CDN 가속 |
| (없음) | **Route 53** | 도메인을 CloudFront/ALB로 연결 |
| `/health` 엔드포인트 | ALB Target Group health check | 컨테이너 생존 확인 |
| `PORT` 환경변수 | ECS Task 환경변수 | 실행 포트 주입 |

### 4-2. 배포 흐름 (개념)

```bash
# 1) 이미지 빌드 (linux/amd64 권장)
docker build -f packages/lanime-web/Dockerfile -t lanime-web .

# 2) ECR 로그인 & 태그 & push
#    aws ecr get-login-password | docker login ...
#    docker tag lanime-web:latest <acct>.dkr.ecr.<region>.amazonaws.com/lanime-web:latest
#    docker push <acct>.dkr.ecr.<region>.amazonaws.com/lanime-web:latest

# 3) ECS 서비스가 그 이미지를 당겨서 실행 (Task Definition에 PORT/health 지정)
# 4) ALB → ECS 연결, CloudFront → ALB, Route 53 → CloudFront
```

> **App Runner vs ECS:** App Runner는 "ECR 이미지만 주면 알아서 굴려주는" 간단
> 버전이라 시작점으로 추천합니다. 트래픽·세밀한 제어가 필요해지면 ECS로 확장합니다.

### 4-3. (선택) 정적 에셋을 S3+CloudFront로 분리

성능을 더 끌어올리려면, 빌드 결과 중 `dist/client/assets/`만 따로 S3에 올리고
CloudFront로 서빙할 수 있습니다. 이때 SSR HTML이 가리키는 에셋 경로를 CDN
도메인으로 맞추기 위해 Vite의 `base` 설정을 사용합니다. **처음에는 불필요** —
nginx/CloudFront 캐시만으로 충분하고, 트래픽이 커질 때 도입하면 됩니다.

---

## 5. 다음 단계 체크리스트

- [ ] 로컬에서 `docker compose up --build`로 정상 기동 확인 (`/health` → ok)
- [ ] lanime-web이 호출하는 백엔드 API 주소(`env.BASE_URL`)를 런타임 환경변수로 정리
- [ ] AWS 계정/리전 결정, **ECR 리포지토리** 생성
- [ ] **App Runner**(간단) 또는 **ECS Fargate + ALB**(유연) 중 택1
- [ ] CloudFront + 도메인(Route 53) + HTTPS(ACM 인증서) 연결
- [ ] (선택) 정적 에셋 S3 분리, CI에서 ECR push 자동화

> 4단계(ECR push 스크립트, ECS Task Definition 등 실제 IaC)는 AWS 계정·리전이
> 정해지면 이 문서를 기준으로 이어서 작성하면 됩니다.
