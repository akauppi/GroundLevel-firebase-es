#
# Dockerfile for running Cypress tests, on the command line
#
# Based on Cypress official images, but:
#   - only provide one (Chrome) browser; Cypress brings in Firefox as well
#
# Provides:
#   - 'cypress' CLI command
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#

#---
# Adopted from -> https://github.com/cypress-io/cypress-docker-images/blob/master/browsers/node18.6.0-chrome105-ff104/Dockerfile
#
# Changes:
#   - not bringing in Firefox
#
FROM cypress/base:18.6.0 as base-chrome

USER root

RUN node --version

# CHANGE: Warning about ARM platform use. See -> https://github.com/cypress-io/cypress-docker-images/blob/master/browsers/node18.6.0-chrome105-ff104/global-profile.sh
#
#COPY ./global-profile.sh /tmp/global-profile.sh
#RUN cat /tmp/global-profile.sh >> /etc/bash.bashrc && rm /tmp/global-profile.sh

# Install dependencies
RUN apt-get update && \
  apt-get install -y \
  fonts-liberation \
  git \
  libcurl4 \
  libcurl3-gnutls \
  libcurl3-nss \
  xdg-utils \
  wget \
  curl \
  ## firefox dependencies
  #bzip2 \
  ## add codecs needed for video playback in firefox
  ## https://github.com/cypress-io/cypress-docker-images/issues/150
  #mplayer \
  \
  # clean up
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# install libappindicator3-1 - not included with Debian 11
RUN wget --no-verbose /usr/src/libappindicator3-1_0.4.92-7_amd64.deb "http://ftp.us.debian.org/debian/pool/main/liba/libappindicator/libappindicator3-1_0.4.92-7_amd64.deb" && \
  dpkg -i /usr/src/libappindicator3-1_0.4.92-7_amd64.deb ; \
  apt-get install -f -y && \
  rm -f /usr/src/libappindicator3-1_0.4.92-7_amd64.deb

# install Chrome browser
RUN node -p "process.arch === 'arm64' ? 'Not downloading Chrome since we are on arm64: https://crbug.com/677140' : process.exit(1)" || \
  (wget --no-verbose -O /usr/src/google-chrome-stable_current_amd64.deb "http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_105.0.5195.102-1_amd64.deb" && \
  dpkg -i /usr/src/google-chrome-stable_current_amd64.deb ; \
  apt-get install -f -y && \
  rm -f /usr/src/google-chrome-stable_current_amd64.deb)

# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

# CHANGE: disabled
## install Firefox browser
#RUN node -p "process.arch === 'arm64' ? 'Not downloading Firefox since we are on arm64: https://bugzilla.mozilla.org/show_bug.cgi?id=1678342' : process.exit(1)" || \
#  (wget --no-verbose -O /tmp/firefox.tar.bz2 https://download-installer.cdn.mozilla.net/pub/firefox/releases/104.0.1/linux-x86_64/en-US/firefox-104.0.1.tar.bz2 && \
#  tar -C /opt -xjf /tmp/firefox.tar.bz2 && \
#  rm /tmp/firefox.tar.bz2 && \
#  ln -fs /opt/firefox/firefox /usr/bin/firefox)



# versions of local tools
RUN echo  " node version:    $(node -v) \n" \
  "npm version:     $(npm -v) \n" \
  "yarn version:    $(yarn -v) \n" \
  "debian version:  $(cat /etc/debian_version) \n" \
  "Chrome version:  $(google-chrome --version) \n" \
  #"Firefox version: $(firefox --version) \n" \
  #"Edge version:    n/a \n" \
  #"git version:     $(git --version) \n" \
  "whoami:          $(whoami) \n"

# a few environment variables to make NPM installs easier
# good colors for most applications
ENV TERM=xterm
# avoid million NPM install messages
ENV npm_config_loglevel=warn
# allow installing when the main user is root
ENV npm_config_unsafe_perm=true


#---
# Adopted from -> https://github.com/cypress-io/cypress-docker-images/blob/master/included/10.8.0/Dockerfile
#
# Brings:
#   - Cypress on top of the OS + Electron + Chrome
#
FROM base-chrome
  #FROM cypress/browsers:node16.14.2-slim-chrome100-ff99-edge

# Cypress CHANGELOG -> https://docs.cypress.io/guides/references/changelog
#
ARG CYPRESS_VER=10.8.0

# avoid too many progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1 \
# disable shared memory X11 affecting Cypress v4 and Chrome
# https://github.com/cypress-io/cypress-docker-images/issues/270
  QT_X11_NO_MITSHM=1 \
  _X11_NO_MITSHM=1 \
  _MITSHM=0 \
  # point Cypress at the /root/cache no matter what user account is used
  # see https://on.cypress.io/caching
  CYPRESS_CACHE_FOLDER=/root/.cache/Cypress \
  # Allow projects to reference globally installed cypress
  NODE_PATH=/usr/local/lib/node_modules

# CI_XBUILD is set when we are building a multi-arch build from x64 in CI.
# This is necessary so that local `./build.sh` usage still verifies `cypress` on `arm64`.
ARG CI_XBUILD

# should be root user
RUN echo "whoami: $(whoami)" \
  && npm config -g set user $(whoami) \
  # command "id" should print:
  # uid=0(root) gid=0(root) groups=0(root)
  # which means the current user is root
  && id \
  && npm install -g typescript \
  && npm install -g "cypress@$CYPRESS_VER" \
  && (node -p "process.env.CI_XBUILD && process.arch === 'arm64' ? 'Skipping cypress verify on arm64 due to SIGSEGV.' : process.exit(1)" \
    || (cypress verify \
    # Cypress cache and installed version
    # should be in the root user's home folder
    && cypress cache path \
    && cypress cache list \
    && cypress info \
    && cypress version)) \
  # give every user read access to the "/root" folder where the binary is cached
  # we really only need to worry about the top folder, fortunately
  && ls -la /root \
  && chmod 755 /root \
  # always grab the latest Yarn
  # otherwise the base image might have old versions
  # NPM does not need to be installed as it is already included with Node.
  && npm i -g yarn@latest \
  # Show where Node loads required modules from
  && node -p 'module.paths' \
  # should print Cypress version
  # plus Electron and bundled Node versions
  && cypress version \
  && echo  " node version:    $(node -v) \n" \
    "npm version:     $(npm -v) \n" \
    "yarn version:    $(yarn -v) \n" \
    "typescript version:  $(tsc -v) \n" \
    "debian version:  $(cat /etc/debian_version) \n" \
    "user:            $(whoami) \n" \
    "chrome:          $(google-chrome --version || true) \n" #\
    #"firefox:         $(firefox --version || true) \n"

ENTRYPOINT ["cypress", "run"]


