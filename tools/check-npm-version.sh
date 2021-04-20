#!/bin/bash
set -eu -o pipefail

# Check that 'npm' is recent enough.
#
# We are not _really_ requiring npm >= 7.7.0 but there were some bugs in earlier 7-series, and npm 6 seems incompatible
# (and slow), so for the sake of keeping moving parts down, 7.7.0 or later. Others - at your own risk!!
#

VER="$(npm --version)"
  # e.g. "7.9.0"

# When reaching npm 10; remove the whole checks
#
if [[ "$VER" < "7.7" ]]; then
  >&2 echo "WARNING: Your npm is less than recommended version ($VER < 7.7.0). Proceed with caution or upgrade!\n"
fi

# peaceful exit