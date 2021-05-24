#!/bin/bash
set -eu -o pipefail

# Check that 'npm' is recent enough.
#
# - npm 6 is incompatible with this project (no 'file:' support)
# - npm 7.6.x had some minor inconsistencies, so recommending 7.7.0+ (but allowing people to proceed)
#
# Requires:
#   - sort -C -V   (macOS ok; Ubuntu ok; Alpine NOT = CI skips this!)
#
_HAVE="$(npm --version)"
  # e.g. "7.9.0"
_WANT="7.7"

# Pass always with Alpine - we know the image has npm high enough.
#
(sort 2>&1 --help) | grep -q 'BusyBox' && (
  >&2 echo "Alpine: skipping npm version check ($_HAVE)."
) && exit 0

printf "%s\n" "7.0" $_HAVE | sort -C -V || (
  >&2 echo "ERROR: Please upgrade to npm >= $_WANT"
  >&2 echo ""
  exit 3
)

# Warn if 7.x but not as high as we'd like
#
printf "%s\n" $_WANT $_HAVE | sort -C -V || (
  >&2 echo "WARNING: Your npm is less than recommended version ($_HAVE < $_WANT). Proceed with caution or upgrade!"
)

# peaceful exit