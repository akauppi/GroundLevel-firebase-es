#!/bin/bash

# For 'firebase deploy', changes the 'engines.node' to be just "14".
#
# This hack allows no annoying warnings (also outside of the 'backend' project). The RIGHT way to do would be for
# Firebase CLI to be fine with '14 || >=15' -like strings.
#
if [ $# -eq 0 ]; then
  echo "Usage: $(basename $0) 1"
  exit 1
fi

ORIG=functions/package.json
#BU_EXT=.~

# Note: 'sed' used so that it's compatible with both macOS (BSD) and GNU variants.

case $1 in
1)
  sed -E 's/("node": ")(.+)(")/\114\3/' $ORIG
  #sed -i$BU_EXT -E 's/("node": ")(.+)(")/\114\3/' $ORIG
;;
#2)
#  [ -f $ORIG$BU_EXT ] && mv $ORIG$BU_EXT $ORIG
#;;
esac
