#!/bin/bash

# tools/strip-firebase.sh
#
# Remove unnecessary files from Firebase '@exp' ("alpha"; 0.900.x) packaging.
#
# During the alpha runs, Firebase seems to pour a lot of unnecessary files to the developers. This script trims it
# down to what is actually needed.
#
# Why this matters?
#   - disk space
#   - download bandwidth; the environment
#   - easier to study the code when cruft is out
#   - IDE indexing may be faster
#

pushd node_modules/@firebase

popd






