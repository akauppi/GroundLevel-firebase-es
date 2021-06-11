#!/bin/bash
#
# Returns as success, if all the mentioned ports are available; with non-zero if taken.
#
# Called either as 'port-is-free' or 'port-is-taken' (makes calling package.json's more readable).
#
# port-is-free:
#   Returns as success, if all the mentioned ports are available; non-zero if any of them is taken.
#
# port-is-taken: (negative of the above)
#   Returns as success, if all the mentioned ports are taken; non-zero if any of them is free.
#
# Flags:
#   --silent  If given, does not output an error if a port is not as wished
#
# Requires:
#   - curl
#
usage() { >&2 echo "Usage: port-is-{taken|free} [--silent] port[,port2[,...]]"; exit $1; }

# Does the command end with '-taken'?
#
_NEGATIVE=
case "$0" in
  *-taken) _NEGATIVE=1; ;;
  *-free) _NEGATIVE=; ;;
  *) usage 97; ;;
esac

_SILENT=

while :
do
  case "$1" in
    --silent) _SILENT=1; shift ;;
    -h | --help) usage 0; ;;
    -*) usage 2; ;;
    *) break; ;;
  esac
done

if [ $# -eq 0 ]; then
  usage 99
fi

_PORTS=$1

for port in ${_PORTS//,/ }; do
  curl -o /dev/null --silent --fail http://localhost:$port
  RC=$?
  if [[ -z $_NEGATIVE ]]; then  # is-free
    if [[ $RC -eq 0 ]]; then
      [[ $_SILENT ]] || >&2 echo "ERROR: Port ${port} is taken!"
      exit 2
    fi
  else  # is-taken
    if [[ $RC -ne 0 ]]; then
      [[ $_SILENT ]] || >&2 echo "ERROR: Port ${port} is free!"
      exit 2
    fi
  fi
done
