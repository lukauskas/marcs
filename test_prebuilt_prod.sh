#!/usr/bin/env bash
set -e
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up