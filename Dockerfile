FROM node:20-slim as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM semtech/ember-proxy-service:1.5.1
ENV STATIC_FOLDERS_REGEX "^/(assets|font|files|handleiding|@appuniversum)/"
ENV EMBER_GN_FEATURE_REGULATORY_STATEMENTS=false

COPY ./proxy/* /config/
COPY --from=builder /app/dist /app
