#!/bin/bash
#
# Returns as success, if all the mentioned ports are available; with non-zero if taken.
#
# Requires:
#   - curl
#
usage() { >&2 echo "Usage: $0 [--silent] port[,port2[,...]]"; exit 1; }

_SILENT=

while :
do
  case "$1" in
    --silent) _SILENT=1; shift ;;
    -h | --help) usage 0; ;;
    *) break; ;;
  esac
done

if [ $# -eq 0 ]; then
  usage
fi

_PORTS=$1

for port in ${_PORTS//,/ }; do
  curl -o /dev/null --silent --fail http://localhost:$port
  RC=$?
  if [[ $RC -eq 0 ]]; then
    [[ $_SILENT ]] || >&2 echo "ERROR: Port ${port} is taken!"
    exit 2
  fi
done
