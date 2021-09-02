#!/bin/bash
set -eu -o pipefail

# List possibly outdated dependencies, in all the subpackages.
#
# Usage:
#   <<
#     $ sh/run-no.sh
#   <<
#
PATHS=". tools dc-tools/firebase-prime/package packages/backend packages/backend/functions packages/app packages/app-deploy-ops"

# Compensate for the macOS/Linux (Docker) modifications of 'esbuild'. Otherwise:
#   <<
#     npm ERR! Cannot set property 'peer' of null
#   <<
#
npm --prefix packages/app prune

for _PATH in $PATHS
do
  npm --prefix "$_PATH" outdated
done
