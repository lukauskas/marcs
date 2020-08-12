#!/usr/bin/env bash
set -e
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --force-rm --parallel --build-arg=COMMIT=$(git rev-parse --short HEAD)  --build-arg=BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') --build-arg=BUILD_TYPE=prod
