#!/bin/bash
#
# Usage:
#   <<
#     $ tools/port-is-free.sh <port>
#   <<
#
# Returns as success, if 'port' is available; with non-zero if taken
#
# Requires:
#   - curl
#
if [ $# -eq 0 ]; then
  echo "Usage: $0 port"
  exit 1
fi

_PORT=$1

curl -o /dev/null --silent --fail http://localhost:$_PORT
RC=$?
if [[ $RC -eq 0 ]]; then
  exit 5
fi
