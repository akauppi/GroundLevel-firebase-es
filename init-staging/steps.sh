#!/bin/bash
set -euf -o pipefail

# docker-js/insideDocker.sh
#
# Steps run inside the 'firebase-ci-builder' Docker image, to:
#
#   1. authenticate with Firebase
#   2. pick a project
#   3. create 'firebase.staging.js'
#   4. deploy the backend
#
# Expects:
#   - 'npm install' is done at the root
#   - 'npm install' is done at 'packages/backend'
#
# tbd. Is there a way to not show the Firebase CLI update suggestion?
# <<
#   ╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
#   │                                                                                                                     │
#   │                                          Update available 9.12.1 → 9.14.0                                           │
#   │                    To update to the latest version using npm, run npm install -g firebase-tools                     │
#   │   For other CLI management options, visit the CLI documentation (https://firebase.google.com/docs/cli#update-cli)   │
#   │                                                                                                                     │
#   │                                                                                                                     │
#   │                                                                                                                     │
#   ╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
# <<
#   - tried 'grep -v -R "╭|│", but that takes away colors (understandable) and gets stuck (don't know why)
#   - Firebase CLI can provide an '--offline' flag, similar to npm. But this idea of using logging (interactive) and
#     automated/scripted, is not in their radar.

firebase login

cd packages/backend

firebase use --add

firebase apps:sdkconfig | (cd ../.. && init-staging/filter-staging.js > ./firebase.staging.js)

npm run ci:deploy

# Not deploying the front end.
#
# We could, but just createing 'firebase.staging.js' and deploying the back-end is already enough for all front-end
# development options to be available. Rather do front-end deployment by CI/CD scripts.
