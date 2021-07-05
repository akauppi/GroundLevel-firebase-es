#!/bin/bash
set -euf -o pipefail
#
# Launch Docker for:
#   - creating the 'firebase.staging.js' file
#   - deploying 'packages/backend'
#
# If 'firebase.staging.js' already exists, the user is asked to confirm its overwriting.
#
# Requires:
#   - read (bash built-in)
#   - docker
#
FIREBASE_STAGING_JS="firebase.staging.js"
IMAGE="firebase-ci-builder:9.12.1-node16-npm7"

# Safety
#
if [[ -f $FIREBASE_STAGING_JS ]]; then
  echo ""
  echo "'$FIREBASE_STAGING_JS' exists."
  echo ""
  read -p "Overwrite it (y/N)?" -n 1 CHOICE
  echo
  if [ "$CHOICE" != y ]; then
    echo ""
    echo "Okay. Not this time."
    exit 0
  fi
fi

echo ""
echo "Going to:"
echo "  1. Launch Docker"
echo "  2. Log you in with Firebase CLI (allows the script to make changes to the Firebase project)"
echo "  3. Pick the active project"
echo "  4. Fetch access values, and place them to 'firebase.staging.js' for front-end development"
echo "  5. Deploy the backend"
echo ""
read -p "Continue (Y/n)?" -n 1 CHOICE
echo
if [[ ! ${CHOICE:-y} =~ ^[Yy]$ ]]; then
  exit 0
fi

docker run -it --rm -v $(pwd):/work -w /work -p 9005:9005 $IMAGE init-staging/steps.sh
