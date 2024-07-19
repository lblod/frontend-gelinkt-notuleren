FROM node:20-slim as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM semtech/static-file-service:0.2.0

ENV EMBER_GN_FEATURE_REGULATORY_STATEMENTS=false

COPY ./proxy/* /config/
COPY --from=builder /app/dist /data
