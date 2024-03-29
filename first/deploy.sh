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
#   - tar
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
# NOTE: 'make -q' is problematic. Sometimes balked without any obvious error!!
#
make refresh-dc > /dev/null

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

# Note: Make a copy into 'tmp/functions' because DC will write an '.env' file in there (impossible if we map ':ro'
#   to '../backend/functions'), but this also allows us to do our installs locally, which is nice.
#
tar -C ../packages/backend --exclude=node_modules -zc functions | tar -C ./tmp -x

npm --prefix tmp/functions -s install --omit=optional

make tmp/functions/.env tmp/firebase.app.prod.json

touch tmp/firebase-debug.log &&
  docker compose run --rm deploy-backend

#---
# App deploy
#
[[ -d .state/configstore && -f .state/.firebaserc ]] || ( >&2 echo "INTERNAL ERROR: Missing '.state'"; false )

(cd ../packages/app && make install && ENV=${ENV-staging} make build)

(cd ../packages/app &&
  node --input-type=module -e "import o from './firebase.hosting.js'; console.log(JSON.stringify(o, null, 2));"
) > tmp/firebase.hosting.json

docker compose run --rm deploy-app

# Wipe clean
rm -rf .state
