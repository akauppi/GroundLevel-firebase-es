#!/bin/bash

#
# Check whether there is an active Firebase project.
#
# If there is, all well (exit with 0). If not, provide an error message and exit with non-zero.
#

# When used from a script (not interactive), 'firebase use' works so (8.9.2):
#
# No active project:
#   <<
#     $ firebase use | more
#
#     ESC[1mESC[31mError:ESC[39mESC[22m No active project
#   <<
#
# Active project:
#   <<
#     $ firebase use | more
#     vue-rollup-example
#   <<
#
# Unfortunately, both provide 0 as return code, so we need this script. :[
#
OUTPUT=$(firebase use)

if [[ $OUTPUT == *"No active project"* ]]; then
  >&2 echo "ERROR: No active project. Please run 'firebase use' or 'firebase use --add'."
  exit -1
fi

exit 0
