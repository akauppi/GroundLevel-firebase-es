#!/bin/bash
set -eu -o pipefail

# Spread the same Firebase activation state as in the root folder to the subpackages:
#
#   packages/backend
#   packages/app
#   packages/app-deploy-ops
#
# NOTE: This OVERRIDES any 'firebase use --add' done in those subpackages. On the other hand if a person
#   runs 'firebase use --add' after running this script, they'll end up in an inconsistent state (using different
#   Firebase projects within the different parts of the monorepo).
#
#   For this reason, the 'README' recommends *only* to change the activation at the root level, with an npm script
#   (that calls us).
#
# Usage:
#   <<
#     $ tools/spread-activation.sh
#   <<
#
# Requires:
#   - firebase
#
#if [ $# -eq 0 ]; then
#  echo "Usage: $0 version"
#  exit 1
#fi

FIREBASE=`pwd`/node_modules/.bin/firebase

if [[ ! -x $FIREBASE ]]; then
  echo "Firebase CLI not found; please run 'npm install'"
  exit 3
fi

# Check that there is an active project
#
# BUG: This DOES NOT RETURN if there's not an active project. Why? Would like to if/else. #help
#
_PROJ=$($FIREBASE use | cat)

if [ "${_PROJ}" == "\nError: No active project" ]; then   # tbd. this line not tested
  echo "NO "
  exit 88
fi

# Have active project.

for subPath in packages/backend packages/app packages/app-deploy-ops ; do
  echo "Activating in: $subPath ..."
  cp .firebaserc $subPath
  (cd $subPath && $FIREBASE use $_PROJ)
done

