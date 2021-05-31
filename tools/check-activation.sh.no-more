#!/bin/bash
set -eu -o pipefail

# Check that there is an active Firebase project (there should be).
#
# NOTE: We can make this LOTS faster by checking from '~/.config/configstore/firebase-tools.json', directly.
#

#if [ $# -eq 0 ]; then
#  echo "Usage: $0 version"
#  exit 1
#fi

if [[ $(npx firebase-tools use | cat) == *"No active project"* ]]; then
  exit 1
fi

# peaceful exit