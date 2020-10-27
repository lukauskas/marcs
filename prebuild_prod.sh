#!/usr/bin/env bash
set -e

# Matomo defaults
MATOMO_DISABLED=true
MATOMO_URL_BASE="http://localhost"
MATOMO_SITE_ID=1

# Potentially override defaults if present
if [ -f "matomo.sourceme" ]; then
  echo "matomo.sourceme found, sourcing matomo settings"
  source "matomo.sourceme"
fi

docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --force-rm --parallel \
  --build-arg=COMMIT=$(git rev-parse --short HEAD)  \
  --build-arg=BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg=BUILD_TYPE=prod \
  --build-arg=MATOMO_DISABLED=$MATOMO_DISABLED \
  --build-arg=MATOMO_URL_BASE=$MATOMO_URL_BASE \
  --build-arg=MATOMO_SITE_ID=$MATOMO_SITE_ID
