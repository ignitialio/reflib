#!/bin/sh

export IIOS_APP_VERSION=1.0.0

docker network create --opt encrypted -d overlay infra
docker stack deploy -c swarm/docker-compose-populate.yml reflib-populate
