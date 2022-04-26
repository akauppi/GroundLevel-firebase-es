#!/bin/sh

# Check that there are no 'npm link' dependencies when doing a production build (we only do production builds).
#
# 'npm link' are handy in co-development of repos, but they should not make it to a 'master' branch (or preferably,
# any commits intended to be shared with others..).
#
# Usage:
#   <<
#     $ tools/check-no-links.sh || ...had links...
#   <<
#
# Requires:
#   - grep
#

# Intended 'file:' references are okay.
#

[ -z $( npm list | grep -- '->' | grep -v '@local/' | grep -v '@_' ) ]
