#!/usr/bin/env bash
set -e

# MARCS `for-web` output (first parameter)
MARCS_FOR_WEB_OUTPUT=$1
if [ ! -f "$MARCS_FOR_WEB_OUTPUT" ]; then
   echo "Please specify location of the marcs.for-web.tar.gz as the first parameter"
   exit 1
fi

# Docker doesn't support symlinks so we need to make a temporary copy of the file
# to all build contexts

DATA_FILE_TEMP_NAME="marcs.for-web.tmp-for-current-build.tar.gz"

declare -a CONTEXTS=("loadbalancer" "loadbalancer/react-frontend" "api" ".")
for CONTEXT in ${CONTEXTS[@]}
do
  DATA_FILE_FULL_PATH="$CONTEXT/$DATA_FILE_TEMP_NAME"

  if [ -f "$DATA_FILE_FULL_PATH" ]; then
      echo "Found old version of build data in $CONTEXT replacing with a new one";
      rm $DATA_FILE_FULL_PATH
  fi
  echo "Copying the marcs.for-web archive to $DATA_FILE_FULL_PATH";
  cp "$MARCS_FOR_WEB_OUTPUT" "$DATA_FILE_FULL_PATH"
done

# Matomo defaults
MATOMO_DISABLED=true
MATOMO_URL_BASE="http://localhost"
MATOMO_SITE_ID=1

# Potentially override defaults if present
if [ -f "matomo.sourceme" ]; then
  echo "matomo.sourceme found, sourcing matomo settings"
  source "matomo.sourceme"
fi

docker-compose build --force-rm --parallel --compress --pull \
    --build-arg=COMMIT=$(git rev-parse --short HEAD)  \
    --build-arg=BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
    --build-arg=BUILD_TYPE=dev \
    --build-arg=MARCS_DATA_FILE="./$DATA_FILE_TEMP_NAME" \
    --build-arg=MATOMO_DISABLED=$MATOMO_DISABLED \
    --build-arg=MATOMO_URL_BASE=$MATOMO_URL_BASE \
    --build-arg=MATOMO_SITE_ID=$MATOMO_SITE_ID

# Cleanup
echo "Build done, cleaning up"
for CONTEXT in ${CONTEXTS[@]}
do
  DATA_FILE_FULL_PATH="$CONTEXT/$DATA_FILE_TEMP_NAME"

  if [ -f "$DATA_FILE_FULL_PATH" ]; then
      rm $DATA_FILE_FULL_PATH
  fi
done

docker-compose up