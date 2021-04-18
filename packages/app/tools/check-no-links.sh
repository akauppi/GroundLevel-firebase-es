#!/bin/bash
set -euf -o pipefail

# Check that there are no 'npm link' dependencies when doing a production build.
#
# 'npm link' are handy in co-development of repos, but they would bring in dependencies at the file system and we
# don't want that. Also it's just good manners to build production things from stable code.
#
# Usage:
#   <<
#     $ tools/check-no-links.sh || ...had links...
#   <<
#
# Requires:
#   - grep
#
# NOTE: ONLY TESTED WITH MACOS.
#

# Also 'file:' references show as links, so we need to grep them out.
#
if [[ ! -z $(npm list | grep -- "->" | grep -v @local/ | grep -v @firebase | grep -v eslint@ ) ]]; then
  exit 7
fi
