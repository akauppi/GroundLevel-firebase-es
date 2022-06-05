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
# Requires:
#   - read (bash built-in)
#   - docker compose
#   - grep
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
echo "  1. Log you in with Firebase CLI (allows the script to make changes to the Firebase project)"
echo "     - please visit the URL soon given and click through the authentication"
echo "  2. Pick the Firebase project"
echo "  3. Deploy the backend"
echo "  4. Build and deploy the front-end"
if [[ $OVERWRITE ]]; then
  echo "  5. Write access values to 'firebase.${ENV-staging}.js' for front-end development"
else
  echo "  5. (NOT update 'firebase.${ENV-staging}.js')"
fi
echo ""
read -p "Continue (Y/n)?" -n 1 CHOICE
echo
if [[ ! ${CHOICE:-y} =~ ^[Yy]$ ]]; then
  exit 0
fi

#--- Execute
#
install -d .state && \
  rm -f .state/*

# Create the state
#
# Note: Important that we create also the mapped folders at host side; otherwise Docker Compose
#   creates them with 'root' access. (WSL2)
#
install -d .state/configstore && \
  touch .state/.captured.sdkconfig .state/.firebaserc && \
  docker compose run --rm --service-ports deploy-auth

if [[ ! -f .state/.captured.sdkconfig ]]; then
  >&2 echo "ERROR: Did not get '.state/.captured.sdkconfig'"
  false
fi

if [[ $OVERWRITE ]]; then
  XX=$(cat .state/.captured.sdkconfig | grep -E '^\s+".+":\s.+,' | grep -E "projectId|appId|locationId|apiKey|authDomain")
    #     "projectId": "...",
    #     "appId": "...",
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

rm .state/.captured.sdkconfig

# Backend
[[ -d .state/configstore && -f .state/.firebaserc ]] || ( >&2 echo "INTERNAL ERROR: Missing '.state'"; false )

install -d .state/functions-node_modules && \
  docker compose run --rm prepare-backend-state

docker compose run --rm deploy-backend

# App
[[ -d .state/configstore && -f .state/.firebaserc ]] || ( >&2 echo "INTERNAL ERROR: Missing '.state'"; false )

(cd ../packages/app && npm install && ENV=${ENV-staging} npm run build)

docker compose run --rm deploy-app

# Cleanup
rm -rf .state
