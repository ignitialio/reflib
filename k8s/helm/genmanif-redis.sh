#!/bin/sh

helm template -n reflib \
  --values ./values/redis-ha.yaml \
  --output-dir ./manifests \
    ./charts/redis-ha
