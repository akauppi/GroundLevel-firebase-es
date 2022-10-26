#!/bin/bash
set -euf -o pipefail
#
# Launch Docker Compose for:
#   - deploying backend
#   - building and deploying the front-end
#   - fetching access values that we use for creating 'firebase.${ENV-staging}.js'
#
# Usage:
#   [ENV=<stage-id>] ./deploy.sh    # default is called 'staging'
#
#   The given name only affects the stage file created.
#
# Note:
#   If 'firebase.${ENV-staging}.js' already exists, the user is asked to confirm its overwriting. If no overwriting,
#   deployment *still* proceeds (this allows using the script for multiple manual deployments).
#
# Note: 'make -q' seems to make also subsequent commands quiet (macOS, make 3.81). Not cool..!
#     Enclose in parantheses if there's '&&'.
#
# Requires:
#   - read (bash built-in)
#   - docker compose
#   - grep
#   - sed
#   - make
#
STAGING_JS="../firebase.${ENV-staging}.js"
OVERWRITE=1

if [[ -f $STAGING_JS ]]; then
  echo ""
  echo "'$(basename $STAGING_JS)' exists."
  echo ""
  read -p "Overwrite it (y/N)?" -n 1 CHOICE
  echo
  sleep 1

  if [ "$CHOICE" != y ]; then
    OVERWRITE=""
  fi
fi

echo "Going to:"
echo "  0. Rebuild a Docker image (maybe)"
echo "  1. Log you in with Firebase CLI (allows the script to make changes to the Firebase project)"
echo "     - please visit the URL soon given and click through the authentication"
echo "  2. Pick the Firebase project"
echo "  3. Deploy the backend"
echo "  4. Build and deploy the front-end"
if [[ $OVERWRITE ]]; then
  echo "  5. Write access values to '${STAGING_JS}' for front-end development"
else
  echo "  5. (NOT update '${STAGING_JS}')"
fi
echo ""
read -p "Continue (Y/n)?" -n 1 CHOICE
echo
if [[ ! ${CHOICE:-y} =~ ^[Yy]$ ]]; then
  exit 0
fi

# Docker Compose doesn't automatically rebuild a container if its source 'Dockerfile' changes.
#
make -q refresh-dc

#---
# Create the state
#
# Note: Important that we create the mapped folders at host side; otherwise DC creates them with 'root' access. (WSL2)
#
install -d .state/configstore && \
  touch .state/.captured.sdkconfig && \
  ([ -f .state/.firebaserc ] || echo '{}' > .state/.firebaserc) && \
  docker compose run --rm --service-ports deploy-auth

if [[ ! -f .state/.captured.sdkconfig ]]; then
  >&2 echo "ERROR: Did not get '.state/.captured.sdkconfig'"
  false
fi

if [[ $OVERWRITE ]]; then
  XX=$(cat .state/.captured.sdkconfig | grep -E '^\s+".+":\s.+,' | grep -E "projectId|appId|databaseURL|locationId|apiKey|authDomain")
    #     "projectId": "...",
    #     "appId": "...",
    #     "databaseURL": "...",
    #     "locationId": "...",
    #     "apiKey": "...",
    #     "authDomain": "...",

  # Required syntax for 'firebase.${ENV-staging}.js' files
  #
  cat > $STAGING_JS << EOF
// Created by 'first/deploy.sh'
//
const config = {
$XX
};
export default config;
EOF
fi

#---
# Backend deploy
#
[[ -d .state/configstore && -f .state/.firebaserc ]] || ( >&2 echo "INTERNAL ERROR: Missing '.state'"; false )

# Note: Creating 'tmp/firebase.prod.json' does not require dependencies to have been installed. Works on a virgin repo.
#
(cd ../packages/backend &&
  (make -q tmp/firebase.app.prod.json) &&

  npm --prefix functions -s install --omit=optional
)

#REMOVE
#R# Make a copy of '../packages/backend/function' that we can modify:
#R# - inject the required region to 'config.js'
#R#
#R# 'node_modules' is not copied over, since it's handled in DC mapping. This shortens the deploy duration.
#R#
#R# NOTE: Do NOT empty 'tmp/functions' before copying, in attempt to keep the shadow of 'node_modules' (those installed
#R#   on earlier DC round) in place. Then again, could also just wipe the whole 'tmp/functions' after deployment.
#R#
#Rtar -C ../packages/backend --exclude=node_modules --exclude=package-lock.json -c functions | tar -C ./tmp -x
#R
#R[[ -f tmp/functions/index.js ]] || ( >&2 echo "ERROR: Didn't properly mirror 'backend/functions'."; false )
#R
#Rcat tmp/functions/config.js | sed -E 's/import\.meta\.env\.DEPLOY_REGION/"'"${DEPLOY_REGION_v2}"'"/' > tmp/functions/x &&
#R  mv tmp/functions/x tmp/functions/config.js
#R  #
#R  # Note: in-place edits with 'sed' are difficult to get right, across OSes. That's why.

touch tmp/firebase-debug.log &&
  docker compose run --rm deploy-backend

#---
# App deploy
#
[[ -d .state/configstore && -f .state/.firebaserc ]] || ( >&2 echo "INTERNAL ERROR: Missing '.state'"; false )

(cd ../packages/app && npm install && ENV=${ENV-staging} make build)

(cd ../packages/app &&
  node --input-type=module -e "import o from './firebase.hosting.js'; console.log(JSON.stringify(o, null, 2));"
) > tmp/firebase.hosting.json

docker compose run --rm deploy-app

# Wipe clean
rm -rf .state
