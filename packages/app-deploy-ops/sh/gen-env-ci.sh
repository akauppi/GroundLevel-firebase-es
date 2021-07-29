#!/bin/bash
set -euf -o pipefail

# Create '.env.ci' contents, based on env.vars.
#
# This allows both CI "just build" and full deploy jobs to utilize the '.env.{$ENV-staging}' mechanism, by providing
# necessary data in the environment variables.
#
# Used by:
#   - npm run ci:build
#

[[ "${RAYGUN_API_KEY-}" ]] || ( >&2 echo "ERROR: Please define 'RAYGUN_API_KEY' env.var."; false )

cat << EOF
# TEMPORARY FILE created by $0; don't change here
#
RAYGUN_API_KEY=${RAYGUN_API_KEY}
EOF