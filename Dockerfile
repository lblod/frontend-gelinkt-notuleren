FROM madnificent/ember:4.12.1-node_18 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN ember build -prod

FROM semtech/ember-proxy-service:1.5.1
ENV STATIC_FOLDERS_REGEX "^/(assets|font|files|handleiding|@appuniversum)/"
ENV EMBER_GN_FEATURE_REGULATORY_STATEMENTS=false

COPY ./proxy/* /config/
COPY --from=builder /app/dist /app
