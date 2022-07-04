#
# Dockerfile for Firebase CLI
#
# Used by:
#   - first/ (manual deployments)
#
# Provides:
#   - 'firebase' CLI
#
# Note:
#   Cloud Build requires that the builder image has 'root' rights; not a dedicated user.
#   Otherwise, one gets all kinds of access right errors with '/builders/home/.npm' and related files.
#
#   This is fine. There is no damage or risk, leaving the builder image with root. Some lines are left permanently
#   disabled, marked as '#|'.
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
FROM node:16-alpine

ARG FIREBASE_TOOLS_VERSION=missing
  #
  # Having a no-good default means the value must be given from Docker Compose.

# Suppress npm update announcements
RUN npm config set update-notifier false

RUN apk --no-cache add openjdk11-jre-headless

#REMOVE
# Auxiliary tools; The '-alpine' base image is based on 'busybox' and doesn't have these.
#
#RUN apk --no-cache add bash curl

# Install 'firebase-tools' in the way that allows us to declare the version.
#
# '--ignore-optional' eliminates warnings on 'gyp'
#
RUN yarn global add --ignore-optional firebase-tools@${FIREBASE_TOOLS_VERSION} \
  && yarn cache clean
  #
  # Note: The installation approach from Firebase docs does not allow stating the version:
  #   'curl -sL https://firebase.tools | bash'

# Don't define an 'ENTRYPOINT' since the caller runs a shell command.
