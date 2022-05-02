#!/bin/bash
set -eu -o pipefail

# List possibly outdated dependencies, in all the subpackages.
#
# Usage:
#   <<
#     $ sh/run-no.sh
#   <<
#
PATHS=". packages/backend packages/backend/functions packages/app packages/app/tools/firebase-prime"

# REMOVE? changed 'esbuild' to be in the interim folder level; can we remove this??
# Compensate for the macOS/Linux (Docker) modifications of 'esbuild'. Otherwise:
#   <<
#     npm ERR! Cannot set property 'peer' of null
#   <<
#
#npm --prefix packages/app prune

for _PATH in $PATHS   # overriding 'PATH'... not recommended.
do
  # 'npm ... outdated' (npm 8.0.0) exits with non-0 if there are outdated entries. We want to keep going.
  #
  npm --prefix "$_PATH" outdated || true
done
