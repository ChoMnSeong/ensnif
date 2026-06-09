# Build context MUST be the repo root (pnpm monorepo).
# Render is configured for this via render.yaml: dockerContext: .
#
#   docker build -f packages/poker-server/Dockerfile -t poker-server .
#
FROM node:22-alpine
WORKDIR /app

# pnpm via corepack (version pinned by root package.json "packageManager").
RUN corepack enable

# Install only poker-server and its workspace deps (poker-engine).
# Manifests first so the install layer caches across source edits.
COPY pnpm-workspace.yaml package.json ./
COPY pnpm-lock.yaml* ./
COPY packages/poker-engine/package.json packages/poker-engine/package.json
COPY packages/poker-server/package.json packages/poker-server/package.json
RUN pnpm install --filter poker-server... --frozen-lockfile=false

# Source.
COPY packages/poker-engine packages/poker-engine
COPY packages/poker-server packages/poker-server

ENV NODE_ENV=production
# The app reads process.env.PORT; Render injects it at runtime.
EXPOSE 4000
CMD ["pnpm", "--filter", "poker-server", "start"]
