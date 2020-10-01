#!/bin/bash
set -euf -o pipefail

# tools/prod-deploy-airbrake.sh
#
# Inform Airbrake (ops monitoring) about the deployment.
#
# Usage:
#   <<
#     $ tools/prod-deploy-airbrake.sh
#   <<
#
# Needs:
#   - curl
#
# References:
#   - Airbrake > Deployment tracking
#     -> https://airbrake.io/docs/features/deploy-tracking/
#

# tbd. Get these from 'public/prod.config.js' with grep and sed. #tbd
#
PROJECT_ID=294803
PROJECT_KEY=040fa45bbab1b8b3ddd744ecd22e066a

#if [[ -z "$PROJECT_ID" || -z "$PROJECT_KEY" ]]; then
#  >2& echo "Need 'PROJECT_ID' and 'PROJECT_KEY' for your Airbrake project."
#  exit -2
#fi

ENVIRONMENT=production

# CUSTOMIZE to match your repo
REPOSITORY=http://github.com/akauppi/GroundLevel-es6-firebase-web

USERNAME=$(whoami)

# See that crucial files are committed (so the git commit checksum makes sense)
#
OUT=$(git status --untracked-files=no --porcelain | grep -v '.md' | grep -v 'tools/')
if [ -n "$OUT" ]; then
  >2& echo "ERROR: you have uncommitted files. Please commit them before proceeding."
  >2& echo "$OUT"
  exit -3
fi

REVISION="$(git rev-parse HEAD)"

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"environment":"'${ENVIRONMENT}'","username":"'${USERNAME}'","repository":"'${REPOSITORY}'","revision":"'${REVISION}'"}' \
  "https://airbrake.io/api/v4/projects/${PROJECT_ID}/deploys?key=${PROJECT_KEY}"
