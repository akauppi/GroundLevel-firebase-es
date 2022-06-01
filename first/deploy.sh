#!/bin/bash
set -euf -o pipefail
#
# Launch Docker Compose for:
#   - deploying backend
#   - building and deploying the front-end
#   - fetching access values that we use for creating 'firebase.${ENV-staging}.js'
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
STAGING_JS="firebase.${ENV-staging}.js"
OVERWRITE=1

if [[ -f $STAGING_JS ]]; then
  echo ""
  echo "'$STAGING_JS' exists."
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
echo "  3. Deploy the backend and front-end"
if [[ $OVERWRITE ]]; then
  echo "  4. Write access values to 'firebase.${ENV-staging}.js' for front-end development"
else
  echo "  4. (NOT update 'firebase.${ENV-staging}.js')"
fi
echo ""
read -p "Continue (Y/n)?" -n 1 CHOICE
echo
if [[ ! ${CHOICE:-y} =~ ^[Yy]$ ]]; then
  exit 0
fi

CAPTURE_FILE=.captured.sdkconfig

# In case old cruft
rm -f ${CAPTURE_FILE}

# Note: Need to change to the directory of the 'docker-compose.yaml'. Something didn't work with '-f'. (Docker 20.10.8)
#
(cd first && CAPTURE_FILE=${CAPTURE_FILE} \
  docker compose run --rm --service-ports deploy
)

if [[ ! -f ${CAPTURE_FILE} ]]; then
  echo &>2 "ERROR: Did not get '${CAPTURE_FILE}"
fi

if [[ $OVERWRITE ]]; then
  XX=$(cat ${CAPTURE_FILE} | grep -E '^\s+".+":\s.+,' | grep -E "projectId|appId|locationId|apiKey|authDomain")
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

rm ${CAPTURE_FILE}
