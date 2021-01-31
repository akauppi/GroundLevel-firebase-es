#!/bin/bash
set -euf -o pipefail

# Check that 'firebase' CLI matches a required version
#
# This needs to be done FAST so that 'npm run dev' is not delayed.
#
# Usage:
#   <<
#     $ tools/firebase-ver-check.sh 8.15.0
#   <<
#
# Requires:
#   - firebase
#   - sort -V -C
#   - grep        // could get away by 'sed' only
#   - sed -nE
#   - cat
#
# NOTE: ONLY TESTED WITH MACOS. (for compatibility, remake as node script)
#
# Even when the current test for 8.15.0 isn't seen needed, we might keep this handy for similar future needs.
#
# <<
#   $ time firebase --version
#   8.14.1
#
#   real	0m2.248s
#   user	0m1.201s
#   sys	0m0.413s
# <<
#
if [ $# -eq 0 ]; then
  echo "Usage: $0 version"
  exit 1
fi

#_CURRENT=
_FN="/usr/local/lib/node_modules/firebase-tools/package.json"
if [ -f "$_FN" ]; then
  _CURRENT=$(cat "$_FN" | grep '"version"' | sed -nE 's/.+: "(.+)",\s*/\1/p')   # eg. 8.15.1
    # real: 0.020 s
else
  # fallback
  _CURRENT=$(firebase --version)
    # real: 2.509 s
fi

_REQUIRED=$1

#echo $_CURRENT
#echo $_REQUIRED

# Let 'package.json' provide the error message
if ! printf "$_REQUIRED\n$_CURRENT\n" | sort -V -C; then
  #>&2 echo "Please install 'firebase-tools' $_REQUIRED or later (now: $_CURRENT)."
  exit 2
fi
