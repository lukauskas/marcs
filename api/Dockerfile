FROM snapanalysis as snap
COPY ./precompile /extra
RUN python /extra/extract_gene_meta.py \
    && python /extra/extract_matrix.py \
    && python /extra/extract_predictors.py \
    && python /extra/extract_annotations.py \
    && python /extra/extract_networks.py \
    && python /extra/extract_ptm_response.py \
    && python /extra/extract_build_version.py

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-alpine3.10

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
    && apk add --no-cache freetype-dev libpng-dev openblas-dev

# Build HDF5 (based on https://github.com/NOAA-OWP/DMOD/blob/5b5eea6f59cb2e5003bc30638b9e05b2bb1fd796/docker/main/nwm/deps/Dockerfile)
RUN cd /tmp/ \
    && wget https://support.hdfgroup.org/ftp/HDF5/releases/hdf5-1.12/hdf5-1.12.0/src/hdf5-1.12.0.tar.gz \
    && tar -xzf hdf5-1.12.0.tar.gz \
    && cd hdf5-1.12.0 \
    && ./configure --prefix=/usr \
    && make -j 8 && make install

# Python deps
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --upgrade numpy==1.18.4 Cython==0.29.17 \
    && pip install --no-cache-dir --upgrade pandas==1.0.3 tables==3.6.1 \
    && pip install --no-cache-dir --upgrade ujson==2.0.3 \
    && rm -rf ~/.cache/pip

RUN apk del .build-deps

COPY --from=snap /precompiled/* /precompiled/
COPY ./app /app

ARG BUILD_DATE
ARG COMMIT

LABEL org.label-schema.vcs-ref="$COMMIT" \
      org.label-schema.build-date="$BUILD_DATE"

RUN mkdir /build && python -c "import pickle; f = open('/build/info.pickle', 'wb'); pickle.dump(dict(date='$BUILD_DATE', commit='$COMMIT'), f, protocol=pickle.HIGHEST_PROTOCOL); f.close()"

# We don't need root to run this...
ENV PORT=8080
EXPOSE 8080
USER 101

