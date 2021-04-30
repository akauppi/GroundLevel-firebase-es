#!/bin/bash
set -eu -o pipefail

# Check that 'npm' is recent enough.
#
# - npm 6 is incompatible with this project (no 'file:' support)
# - npm 7.6.x had some minor inconsistencies, so recommending 7.7.0+ (but allowing people to proceed)
#
# Requires:
#   - sort -C -V   (macOS ok)
#
_HAVE="$(npm --version)"
  # e.g. "7.9.0"
_WANT="7.7"

printf "%s\n" "7.0" $_HAVE | sort -C -V || (
  >&2 echo "ERROR: Please upgrade to npm >= $_WANT"
  >&2 echo ""
  exit 3
)

# Check the input is sorted ('sort -C' return code is non-zero if unsorted)
#
printf "%s\n" $_WANT $_HAVE | sort -C -V || (
  >&2 echo "WARNING: Your npm is less than recommended version ($_HAVE < $_WANT). Proceed with caution or upgrade!"
)

# peaceful exit