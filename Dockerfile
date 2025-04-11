FROM node:20-slim AS builder

LABEL maintainer="info@redpencil.io"

# installing the latest corepack manually because of https://github.com/nodejs/corepack/issues/612
RUN npm i -g corepack@0.31
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN npm run build

FROM semtech/static-file-service:0.2.0

ENV EMBER_GN_FEATURE_REGULATORY_STATEMENTS=false

COPY ./proxy/* /config/
COPY --from=builder /app/dist /data
