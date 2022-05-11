#
# Dockerfile for Firebase prime.dc
#
# Calling environment:
#   - local development
#
# Environment:
#   - root user
#   - '/work' as CWD
#
# Expects:
#   - host having Firebase Firestore and auth ports open
#     - '${FIRESTORE_PORT}' and '${AUTH_PORT}' pointing to them
#   - /work/users.js
#   - /work/docs.js
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#

# Node images -> https://hub.docker.com/_/node
FROM node:18-alpine

#ENV USER user
WORKDIR /work

# Suppress npm update announcements
RUN npm config set update-notifier false

COPY src src
COPY package.json .

RUN echo package-lock=false > .npmrc

# Install dependencies
#
RUN npm install

# Allow manual user invocation.
#
#ENV USER_HOME /home/${USER}

#|# Now changing to user (no more root)
#|USER ${USER}
#|   # $ whoami
#|   # user

# Sample command - provide one by the caller DC
CMD \
  npx firebase-prime --project=demo-app ./docs.js ./users.js

# Don't define an 'ENTRYPOINT' since we provide multiple ('firebase', 'npm'). Cloud Build scripts can choose one.
