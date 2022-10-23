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
#     - 'firebase.app.js' (or override by 'FIREBASE_APP_JS' env.var.) that provides the above emulator ports
#   - /work/users.js
#   - /work/docs.js
#
# Notes:
#   All we want is a minimal Node.js container (no native compilation tools required). However, such are not widely
#   available, yet (May-2022). Once they are, we could switch to them (maybe ~40MB footprint).
#
#   Also, the base image could provide a user; we don't need root access.

# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#

# Node images -> https://hub.docker.com/_/node
#   node:18-alpine  171MB
#
FROM node:18-alpine

WORKDIR /work

# Suppress npm update announcements
RUN npm config set update-notifier false

COPY src src
COPY package.json .

RUN echo package-lock=false > .npmrc

# Seems both 'npm install' (for getting the dependencies) and 'npm install -g' (for having 'firebase-prime' as a CLI)
# are needed.
#
RUN npm install && \
  npm install -g

ENV NODE_PATH=/usr/local/lib/node_modules

# Override
CMD \
  firebase-prime --help
