#!/bin/bash
set -eu -o pipefail

# Helper for launching Firebase Emulators within Docker
#
# Usage:
#   <<
#     ... <firebase-command>
#   <<
#
# Firebase Emulators are launched and kept running in the current terminal.
#
# Requires:
#   - docker
#
# tbd. This could be done as a Node.js process, and the ports read from 'firebase.json'.
#   + place under 'tools'
#
usage() { >&2 echo "Usage: $0 firebase-cmd"; exit 1; }

if [ $# -eq 0 ]; then
  usage
fi

IMAGE=firebase-ci-builder:9.11.0-node16-npm7

# Launch Docker, keep running
#
_CMD="docker run --rm --sig-proxy=true -v $(pwd):/work -w /work -p 4000:4000 -p 6767:6767 -p 5002:5002 $IMAGE $1"
echo $_CMD
$_CMD
