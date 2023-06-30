FROM bynect/hypercorn-fastapi:python3.8-alpine

# This is based on https://github.com/nginxinc/docker-nginx-unprivileged/blob/master/stable/alpine/Dockerfile
# mimicking setup for nginx
RUN mkdir -p /var/cache/fastapi \
    && addgroup -g 101 -S fastapi \
    && adduser -S -D -H -u 101 -h /var/cache/fastapi -s /sbin/nologin -G fastapi -g fastapi fastapi \
    && chown -R 101:0 /var/cache/fastapi \
    && chmod -R g+w /var/cache/fastapi

# Install dependancies
# echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
#    echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
RUN apk --update add --no-cache --virtual .build-deps \
                                          build-base \
                                          curl \
                                          curl-dev \
                                          git \
                                          gcc \
                                          gfortran \
                                          g++ \
                                          libtool \
                                          musl-dev \
                                          m4 \
                                          tar \
                                          zlib-dev \
    && apk add --no-cache freetype-dev libpng-dev openblas-dev rust hdf5-dev cargo

# Python deps
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --upgrade numpy==1.22.3 Cython==0.29.28 \
    && pip install --no-cache-dir --upgrade pandas==1.4.2 tables==3.7.0 \
    && pip install --no-cache-dir --upgrade --no-binary=orjson orjson==3.6.7 \
    && rm -rf ~/.cache/pip

RUN apk del .build-deps

ARG MARCS_DATA_FILE
RUN mkdir /tmp/marcsimport
COPY $MARCS_DATA_FILE /tmp/marcsimport/marcs-data-file.tar.gz
RUN tar -xvf /tmp/marcsimport/marcs-data-file.tar.gz -C /tmp/marcsimport \
    && mkdir /precompiled/ \
    && mv /tmp/marcsimport/output/web/api/precompiled/* /precompiled/ \
    && chown -R 101:0 /precompiled/ \
    && rm -rf /tmp/marcsimport

COPY ./app /app

ARG BUILD_DATE
ARG COMMIT

LABEL org.label-schema.vcs-ref="$COMMIT" \
      org.label-schema.build-date="$BUILD_DATE"

RUN mkdir /build && python -c "import pickle; f = open('/build/info.pickle', 'wb'); pickle.dump(dict(date='$BUILD_DATE', commit='$COMMIT'), f, protocol=pickle.HIGHEST_PROTOCOL); f.close()"

ENV TCP_PORT=8080
EXPOSE 8080

# Switch back to non-root user
USER 101

