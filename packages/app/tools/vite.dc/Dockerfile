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
FROM node:18-alpine

# Vite CHANGELOG -> https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md
#
ARG VITE_VER=4.0.0-alpha.4
  # VITE_VER=3.2.3

WORKDIR /work

# Suppress npm update announcements
RUN npm config set update-notifier false

# Install dependencies
#
# Make all globally installed libraries visible to the work directory (only binaries would show, without this).
# Needed for:
#   - 'vite', imported by '@vite/plugin-vue' (project side)
#
RUN npm install -g --no-save vite@$VITE_VER && \
  ln -s /usr/local/lib/node_modules /node_modules

# Override
CMD \
  vite --help
