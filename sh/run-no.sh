#!/bin/bash
set -eu -o pipefail

# List possibly outdated dependencies, in all the subpackages.
#
# Usage:
#   <<
#     $ sh/run-no.sh
#   <<
#
# Note:
#   - 'packages/app/.../firebase-prime' considered a dockerized tool (implemented in 'npm' but we don't want to know
#     about its specifics; also it can use old versions).
#
PATHS=". packages/backend packages/backend/functions packages/app"

for _PATH in $PATHS   # overriding 'PATH'... not recommended.
do
  # 'npm ... outdated' (npm 8.0.0) exits with non-0 if there are outdated entries. We want to keep going.
  #
  npm --prefix "$_PATH" outdated || true
done
