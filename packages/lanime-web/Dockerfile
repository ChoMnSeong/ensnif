# syntax=docker/dockerfile:1
#
# lanime-web (SSR) production image — pnpm monorepo.
#
# IMPORTANT: build context MUST be the repo root (this is a pnpm workspace).
#   docker build -f packages/lanime-web/Dockerfile -t lanime-web .
# docker-compose.yml at the repo root already sets `context: .`.
#
# Why multi-stage? We need heavy tools (vite, typescript) to BUILD, but the
# thing we SHIP is just Node + the built output + production deps. Splitting
# build vs runtime keeps the final image small and free of build-time tooling.
#
#   base    → node + pnpm (corepack)
#   deps    → install workspace deps (manifests copied first = cached layer)
#   build   → compile @ensnif/common (tsc) + lanime-web (vite client + SSR),
#             then drop devDependencies
#   runtime → copy only what the SSR server needs at run time

# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /app
# pnpm is provided by corepack; its version is pinned by the root
# package.json "packageManager" field, so builds are reproducible.
RUN corepack enable

# ---------- deps ----------
# Copy ONLY manifests first. Docker caches this layer and skips the (slow)
# install step on rebuilds unless a package.json / lockfile actually changes.
FROM base AS deps
COPY pnpm-workspace.yaml package.json ./
COPY pnpm-lock.yaml* ./
COPY packages/common/package.json packages/common/package.json
COPY packages/lanime-web/package.json packages/lanime-web/package.json
# Install lanime-web AND its workspace deps (the "..." suffix), dev deps
# included — they are required to build (vite, typescript, ...).
RUN pnpm install --filter lanime-web... --frozen-lockfile=false

# ---------- build ----------
FROM deps AS build
# Root tsconfig that packages/lanime-web/tsconfig.json extends (../../tsconfig.base.json).
# Vite reads tsconfig during the build, so this must be present.
COPY tsconfig.base.json ./
# Now bring in the source for the packages we actually compile.
COPY packages/common packages/common
COPY packages/lanime-web packages/lanime-web
# "lanime-web..." builds dependencies first in topological order:
#   1) @ensnif/common  → tsc        → packages/common/dist
#   2) lanime-web       → vite build → dist/client (browser) + dist/server (SSR)
RUN pnpm --filter lanime-web... build
# Build tooling is no longer needed → strip devDependencies so we copy a
# lean, production-only node_modules into the runtime stage.
RUN pnpm prune --prod

# ---------- runtime ----------
FROM base AS runtime
ENV NODE_ENV=production
# server/index.js reads process.env.PORT (default 5173). Render/ECS/etc.
# inject their own PORT at run time and this is overridden.
ENV PORT=5173

# Keep the workspace layout intact so pnpm's symlinked node_modules resolve.
COPY --from=build /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules

# @ensnif/common is consumed at run time via its built dist (it is symlinked
# into node_modules, so the real files must be present here).
COPY --from=build /app/packages/common/package.json ./packages/common/package.json
COPY --from=build /app/packages/common/dist ./packages/common/dist

# lanime-web: the (un-bundled) SSR server entry + build output + local symlinks.
COPY --from=build /app/packages/lanime-web/node_modules ./packages/lanime-web/node_modules
COPY --from=build /app/packages/lanime-web/package.json ./packages/lanime-web/package.json
COPY --from=build /app/packages/lanime-web/server ./packages/lanime-web/server
COPY --from=build /app/packages/lanime-web/dist ./packages/lanime-web/dist

# Run from the package dir so the server's relative paths (./dist/client,
# ../dist/server) resolve exactly like `pnpm --filter lanime-web server` does.
WORKDIR /app/packages/lanime-web
EXPOSE 5173
# NODE_ENV is already set, so we run node directly (no cross-env needed).
CMD ["node", "server/index.js"]
