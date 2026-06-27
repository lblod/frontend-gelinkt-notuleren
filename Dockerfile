FROM node:22-slim AS builder

LABEL maintainer="info@redpencil.io"

RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN npm run build

FROM semtech/static-file-service:0.2.0

ENV EMBER_GN_FEATURE_REGULATORY_STATEMENTS=false

COPY ./proxy/* /config/
COPY --from=builder /app/dist /data
