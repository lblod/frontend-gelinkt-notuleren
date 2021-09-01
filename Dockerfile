FROM madnificent/ember:3.20.0 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ember build -prod

FROM semtech/ember-proxy-service:1.5.1
ENV STATIC_FOLDERS_REGEX "^/(assets|font|files|handleiding|@appuniversum)/"
ENV EMBER_FEATURE_FLAG_EDITOR_HTML_PASTE true
ENV EMBER_FEATURE_FLAG_EDITOR_EXTENDED_HTML_PASTE true
ENV EMBER_FEATURE_FLAG_EDITOR_CUT true
COPY ./proxy/torii-authorization.conf /config/torii-authorization.conf
COPY --from=builder /app/dist /app
