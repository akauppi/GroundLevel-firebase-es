#!/bin/bash
set -eu -o pipefail

# List possibly outdated dependencies, in all the subpackages.
#
# Usage:
#   <<
#     $ sh/run-no.sh
#   <<
#

PATHS=". tools packages/backend packages/backend/functions packages/app packages/app-deploy-ops"

for _PATH in $PATHS
do
  npm --prefix "$_PATH" outdated
done
