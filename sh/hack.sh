#!/bin/bash

#
# Prepare the repo for CI
#
# - Changes the 'engines.node' in Cloud Functions to be just "14".
# - Creates 'roll/out' folder that gets removed in transit.
#
# The correct way to do would be for Firebase CLI to be fine with '14 || >=15' -like strings.
#
# Environment:
#   Alpine Linux (Cloud Build)
#
FN=packages/backend/functions/package.json

sed -i -E 's/("node": ")(.+)(")/\114\3/' $FN

mkdir app-deploy-ops/roll/out
