#!/bin/bash
set -euf -o pipefail

# Create the contents of a '../../firebase.*.js' file, based on the active Firebase project.
#
# Context:
#   Alpine Linux
#
# Requires:
#   - grep
#

CATCH=$(firebase apps:sdkconfig | grep -E '^\s+".+":\s.+,')
  #
  # <<
  #   // Copy and paste this into your JavaScript code to initialize the Firebase SDK.
  #   // You will also need to load the Firebase SDK.
  #   // See https://firebase.google.com/docs/web/setup for more details.
  #
  #   firebase.initializeApp({
  #     "projectId": "...",
  #     "appId": "...",
  #     "storageBucket": "...",
  #     "locationId": "...",
  #     "apiKey": "...",
  #     "authDomain": "...",
  #     "messagingSenderId": "...",
  #     "measurementId": "..."
  #   });
  # <<

# Required syntax for 'firebase.${ENV-staging}.js' files
#
cat << EOF
// DO NOT EDIT THIS FILE. It's autogenerated.
//
const config = {
$CATCH
};
export default config;
EOF