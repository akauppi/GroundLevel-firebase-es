#!/bin/bash
#
# Usage:
#   <<
#     $ tools/port-is-free.sh <port[,port2[,...]]>
#   <<
#
# Returns as success, if all the mentioned ports are available; with non-zero if taken.
#
# Requires:
#   - curl
#
if [ $# -eq 0 ]; then
  echo "Usage: $0 port"
  exit 1
fi

_PORTS=$1

for port in ${_PORTS//,/ }; do
  curl -o /dev/null --silent --fail http://localhost:$port
  RC=$?
  if [[ $RC -eq 0 ]]; then
    >&2 echo "ERROR: Port ${port} is taken!"
    exit 2
  fi
done
