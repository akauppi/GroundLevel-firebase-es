#!/bin/bash

# Mount all these:
#
#data.js
#*.rules
#*.test.js

FILES=$(ls data.js *.rules *.test.js)

echo $FILES

#docker run \
#  --mount type=bind,source="$(pwd)"/target,target=/app
