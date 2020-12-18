FROM madnificent/ember:3.5.0 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ember build -prod
ADD https://github.com/lblod/handleiding-gelinkt-notuleren/archive/master.tar.gz handleiding.tar.gz
RUN tar xzf handleiding.tar.gz && rm handleiding.tar.gz && mv handleiding-gelinkt-notuleren-master /app/dist/handleiding

FROM semtech/ember-proxy-service:1.5.1
ENV STATIC_FOLDERS_REGEX "^/(assets|font|files|handleiding|@appuniversum)/"

COPY ./proxy/torii-authorization.conf /config/torii-authorization.conf
COPY --from=builder /app/dist /app
