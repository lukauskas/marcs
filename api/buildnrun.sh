#!/usr/bin/env bash
set -e
docker kill snapapicont || true
docker build --build-arg=COMMIT=$(git rev-parse --short HEAD)  --build-arg=BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') -t snapapi .
docker run --rm --env WEB_CONCURRENCY=2 --name snapapicont -p 80:8080 snapapi
