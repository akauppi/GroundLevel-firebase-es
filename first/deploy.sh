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
#   - sed
#   - make
#
# tbd. Move this into a 'Makefile', eventually.
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

#--- Execute

# Create the state
#
# Note: Important that we create also the mapped folders at host side; otherwise Docker Compose creates them with
#       'root' access. (WSL2)
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

LOCATION_ID=$( cat .state/.captured.sdkconfig | grep "\"locationId\":" | cut -d '"' -f4 )
[ ! -z $LOCATION_ID ] || ( >&2 echo "WARN: Did not find 'locationId' in Firebase app configuration." )    # if we get this warning, no guarantee how deployment will succeed

# Backend
[[ -d .state/configstore && -f .state/.firebaserc ]] || ( >&2 echo "INTERNAL ERROR: Missing '.state'"; false )

# Note: Running this 'make' does not require dependencies to have been installed. Works on a virgin repo.
#
(cd ../packages/backend && make -q tmp/firebase.json)

# Note: Need to copy 'backend/functions' contents to our temporary mirror. This is so that no 'functions/node_modules'
#   needs to be created where the developer would see it. Maybe overkill.
#
install -d .state/functions/node_modules && \
  cp -r ../packages/backend/functions .state/ && \
  docker compose run --rm pre-deploy-backend

# Inject the location id to the right source file.
#
# tbd. Make this generic so any 'import.meta.env.LOCATION_ID' within '.state/functions/**.js' gets replaced.
#
cat .state/functions/regional.js | sed -E 's/import\.meta\.env\.LOCATION_ID/"'"${LOCATION_ID}"'"/' > .state/functions/tmp
mv .state/functions/tmp .state/functions/regional.js

docker compose run --rm deploy-backend

# App
[[ -d .state/configstore && -f .state/.firebaserc ]] || ( >&2 echo "INTERNAL ERROR: Missing '.state'"; false )

(cd ../packages/app && npm install && ENV=${ENV-staging} make build)

(cd ../packages/app &&
  node --input-type=module -e "import o from './firebase.hosting.js'; console.log(JSON.stringify(o, null, 2));"
) > .state/firebase.hosting.json

docker compose run --rm deploy-app

# Wipe clean
rm -rf .state
