#!/bin/sh

export IIOS_APP_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "app version: ${IIOS_APP_VERSION}"

docker-compose -f ${PWD}/tools/docker/docker-compose.yml stop
docker-compose rm -f

if command -v iio 2>/dev/null; then
  iio infra dev --rm
  if [ $? -ne 0 ]
  then
    echo "iio version must be >=2.2.1: 'npm i -g @ignitial/iio-cli'"
    exit 1
  fi
else
  echo "iio not installed: 'npm i -g @ignitial/iio-cli'"
  exit 1
fi
