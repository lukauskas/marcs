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

declare -a CONTEXTS=(".")
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

docker kill snapapicont || true

docker build --build-arg=COMMIT=$(git rev-parse --short HEAD)  --build-arg=BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') --build-arg=MARCS_DATA_FILE="./$DATA_FILE_TEMP_NAME"  -t snapapi .

# Cleanup
echo "Build done, cleaning up"
for CONTEXT in ${CONTEXTS[@]}
do
  DATA_FILE_FULL_PATH="$CONTEXT/$DATA_FILE_TEMP_NAME"

  if [ -f "$DATA_FILE_FULL_PATH" ]; then
      rm $DATA_FILE_FULL_PATH
  fi
done

echo "Startingcontainer. We're forwarding port 8080 to port 80, you should be able to access api at http://127.0.0.1/ (port 80, note no SSL support)"
docker run --rm --env WEB_CONCURRENCY=2 --name snapapicont -p 80:8080 -it snapapi
