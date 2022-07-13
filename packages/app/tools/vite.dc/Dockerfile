#
# Dockerfile for local running of Vite
#
# Provides:
#   - empty work folder (/work)
#   - 'vite' installed globally and available as a CLI tool.
#
# Note:
#   The trick of using 'AS' (and corresponding 'target' in a Docker Compose file), is described in:
#     -> https://stackoverflow.com/a/53289193/14455 (SO answer)
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#

# This image provides a basic 'vite' for development purposes. See 'vite_for_build' (below) for one with extras.
#
FROM node:18-alpine AS vite_plain

# Vite CHANGELOG -> https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md
#
ARG VITE_VER=3.0.0
  #
  # NOTE: IF YOU CHANGE THE VERSION, RUN 'npm run _refresh' TO FORCE A REBUILD. (If You know how to make 'docker compose run'
  #     automatically notice a build file has changed, please say so!)

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

#---
# Version with extras
#
# Provides:
#   - 'rollup-plugin-visualizer' [1] installed, for creating 'stats.html'
#
#     [1]: https://github.com/btd/rollup-plugin-visualizer
#
FROM vite_plain AS vite_for_build

RUN npm install -g rollup-plugin-visualizer && \
  (install -d /node_modules && cd /node_modules && ln -s $NODE_PATH/rollup-plugin-visualizer .)
