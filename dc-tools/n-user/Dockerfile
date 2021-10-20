#
# Using Firebase Emulators, from Docker Compose
#
# Provides:
#   - node.js (14 or 16) and npm (6 or >= 7.7)
#   - bash
#   - socat
#   - 'wait-for-it'       // from: https://github.com/vishnubob/wait-for-it/blob/master/wait-for-it.sh
#     The de-facto shell script standard for waiting a port, available eg. in Debian/Ubuntu by `apt-get install`.
#
# Context:
#   - user 'user' created
#   - home '/home/user'
#
# Note:
#   Using 'node:{14|16}-alpine' (~112MB) is FASTER than the Cloud Build 'gcr.io/cloud-builders/npm' (943MB) image.
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
ARG NODE
FROM node:${NODE:-16}-alpine

ENV USER user

RUN apk --no-cache add bash socat

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

RUN adduser --disabled-password ${USER}

# Remain running as root; easier especially for Windows+WSL2 (access rights stuff which isn't a concern
# on macOS). Anyhow, running as root is fine.
#
#|# Now changing to user (no more root)
#|USER ${USER}
#|   # $ whoami
#|   # user
#|
#|WORKDIR /home/${USER}

# Suppress npm update announcements (creates '~/.npmrc' with 'update-notifier=false')
#
RUN npm config set update-notifier false

# No entrypoint
