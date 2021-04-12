#!/bin/bash
set -eu -o pipefail

#
# This was getting a teeny bit too complex in the 'package.json'
#
# The story:
#   Firebase @performance doesn't work for us, without a patch.
#   Deploying the patch started having all kinds of weird side effects (the patching failing; the contents are okay).
#
# We only get called when the patch ISN*T already there; 'package.json' checks that for us.
#
# Called by:
#   'npm install', via 'postinstall'
#
# Needs:
#   - patch
#

#---
# To create the patch:
#
# <<
#   $ diff -u -b index.esm2017.js.untouched node_modules/@firebase/performance/dist/index.esm2017.js > hack/@firebase-performance-0.900.20.patch
# <<
#---

PATCH=hack/@firebase-performance-0.900.20.patch

TARGET=node_modules/@firebase/performance/dist/index.esm2017.js
#TARGET=b

patch -p0 --forward $TARGET $PATCH

# Also remove the js.map since its line numbers won't be valid, any more.
#
rm -f node_modules/@firebase/performance/dist/index.esm2017.js.map
