#
# Dockerfile for running Cypress tests, on the command line
#
# Note: Cypress is also (and foremost) a native GUI application.
#
# Provides:
#   - empty work folder (/work)
#   - 'cypress' installed globally and available as a CLI tool.
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
FROM node:18-alpine

# Cypress CHANGELOG -> https://docs.cypress.io/guides/references/changelog
#
ARG CYPRESS_VER=10.7.0

WORKDIR /work

# Requirements -> https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies
#
RUN apt-get update \
  && apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
  && rm -rf /var/lib/apt/lists/*


# Suppress npm update announcements
RUN npm config set update-notifier false

# Install dependencies
#
RUN npm install -g --no-save cypress@$CYPRESS_VER

# Override
CMD \
  cypress --help
