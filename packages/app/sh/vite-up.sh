#!/bin/bash
set -euf -o pipefail

# Launch Vite to port 3000
#

docker compose up

# Waits for port 4000
docker compose run init

npx vite --port 3000 --mode dev_local
