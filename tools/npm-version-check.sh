#!/bin/bash
set -eu -o pipefail

# Check that 'npm' is recent enough.
#
# We are not _really_ requiring npm >= 7.7.0 but there were some bugs in earlier 7-series, and npm 6 seems incompatible
# (and slow), so for the sake of keeping moving parts down, 7.7.0 or later. Others - at your own risk!!
#
# Requires:
#   - sort -C -V   (macOS ok)
#

_HAVE="$(npm --version)"
  # e.g. "7.9.0"
_WANT="7.7"

# Check the input is sorted ('sort -C' return code is non-zero if unsorted)
#
printf "%s\n" $_WANT $_HAVE | sort -C -V || (
  >&2 echo "WARNING: Your npm is less than recommended version ($_HAVE < $_WANT). Proceed with caution or upgrade!\n"
)

# peaceful exit