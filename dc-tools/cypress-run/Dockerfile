#
# Provides:
#   - cypress headless
#   - bash
#   - 'wait-for-it'       // from: https://github.com/vishnubob/wait-for-it/blob/master/wait-for-it.sh
#     The de-facto shell script standard for waiting a port, available eg. in Debian/Ubuntu by `apt-get install`.
#
# Note:
#   'cypress/included' (>1GB) provides more than we need (eg. no need for 'xvfb'). It's possible to craft a lighter
#   image, at some point (users could customize, which browsers they want to include). For now, it's just getting
#   things running (Cypress in CI). Cypress could offer a 'cypress/headless' image that we can use as-is. :) 🤞
#
# Context:
#   - user 'user' created
#   - home '/home/user'
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
ARG CYPRESS_TAG=8.3.0

FROM cypress/included:${CYPRESS_TAG}
  #
  # user: root
  # cwd:  /
  # bash: x
  # based image: Debian 10.10
  #
  # ENTRYPOINT: ['cypress', 'run']

#|ENV USER user

# 'wait-for-it'
#
#   This is the same code as Debian/Ubuntu has via 'apt-get install wait-for-it'.
#
#   Intentionally:
#     - drop the '.sh' so the script becomes easier to use
#     - check checksum so we can (must!) approve any upstream changes
#
#   Note:
#     - 'sha256sum' is built-in in Alpine Linux. We could use 'md5sum' as well.
#
#   Note:
#     - The 'ADD <url>' variant we use for Alpine DOES NOT BUILD under Cloud Build (Aug 21):
#       <<
#         Step #3: Step 3/5 : ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
#         #Step #3: Service 'cypress' failed to build : ADD failed: Get "https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh": read tcp 10.150.0.13:54152->185.199.108.133:443: read: connection reset by peer
#         #Finished Step #3
#       <<
#
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
#|
#|RUN echo "b7a04f38de1e51e7455ecf63151c8c7e405bd2d45a2d4e16f6419db737a125d6  /usr/local/bin/wait-for-it" | sha256sum -c \
#|  && chmod +rx /usr/local/bin/wait-for-it

# Could 'apt-get', since 'cypress/included' is based on Debian (but the maintainability of said package is arguable).
#
# Alternatively, we can download the `.sh` within the host repo, have Cloud Build install it from a local file. tbd.
#
#§ADD wait-for-it.sub/wait-for-it.sh /usr/local/bin/wait-for-it

RUN echo "b7a04f38de1e51e7455ecf63151c8c7e405bd2d45a2d4e16f6419db737a125d6  /usr/local/bin/wait-for-it" | sha256sum -c \
  && chmod +rx /usr/local/bin/wait-for-it

#|RUN adduser --disabled-password ${USER}

#|WORKDIR /home/${USER}

#|# Now changing to user (no more root)
#|USER ${USER}
#|   # $ whoami
#|   # user

# No default entry point
ENTRYPOINT []

