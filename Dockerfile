FROM node:18-alpine AS base
WORKDIR /app

# Corepack 활성화
RUN corepack enable

FROM base AS builder
COPY . .
RUN yarn
WORKDIR package/lanime-web
RUN yarn build
