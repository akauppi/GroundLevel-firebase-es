#
# Provides:
#   - node.js (16) and npm (>= 7.7)
#   - bash, curl
#   - 'wait-for-it'       // from: https://github.com/vishnubob/wait-for-it/blob/master/wait-for-it.sh
#     The de-facto shell script standard for waiting a port, available eg. in Debian/Ubuntu by `apt-get install`.
#   - 'firebase-prime' command line for priming Firestore docs and users
#
# Context:
#   - user 'user' created
#   - home '/home/user'
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
FROM node:16-alpine

ENV USER user

# Suppress npm update announcements
RUN npm config set update-notifier false

RUN apk --no-cache add bash curl

# 'wait-for-it'
#
#   This is the same code as Debian/Ubuntu has via 'apt-get install wait-for-it'.
#
#   For Alpine, it's not available as a package (likely because it needs Bash); but that's not a problem.
#
#   Intentionally:
#     - drop the '.sh' so the script becomes easier to use
#     - check checksum so we can (must!) approve any upstream changes
#
#   Note:
#     - 'sha256sum' is built-in in Alpine Linux. We could use 'md5sum' as well.
#
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it

RUN echo "b7a04f38de1e51e7455ecf63151c8c7e405bd2d45a2d4e16f6419db737a125d6  /usr/local/bin/wait-for-it" | sha256sum -c \
  && chmod +rx /usr/local/bin/wait-for-it

# 'firebase-prime'
#
# Make it available via 'npm', globally, as a command line tool.
#
ADD package /tmp/firebase-prime.package

RUN cd /tmp/firebase-prime.package \
  && npm install \
  && npm install -g

RUN adduser --disabled-password ${USER}

WORKDIR /home/${USER}

# Now changing to user (no more root)
USER ${USER}
   # $ whoami
   # user

# No default entry point
