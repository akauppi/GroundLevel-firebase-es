#
# Dockerfile for local running of Vite
#
# Provides:
#   - empty work folder (/work)
#   - 'vite' installed globally and available as a CLI tool.
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#

# Node images -> https://hub.docker.com/_/node
#   node:18-alpine  171MB
#   node:16-alpine  110MB
#
FROM node:16-alpine

# Vite CHANGELOG -> https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md
#
ARG VITE_VER=3.0.0-alpha.13

WORKDIR /work

# Suppress npm update announcements
RUN npm config set update-notifier false

# Install dependencies
#
RUN npm install -g --no-save vite@$VITE_VER

ENV NODE_PATH=/usr/local/lib/node_modules

# Override
CMD \
  vite --help
