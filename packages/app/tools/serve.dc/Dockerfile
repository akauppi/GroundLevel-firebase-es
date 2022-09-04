#
# Dockerfile for local HTTP serving
#
# Expects:
#   - a folder with web content, mapped to '/work/public'
#   - 'PORT' env.var. (optional; default 8080)
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#

# Node images -> https://hub.docker.com/_/node
#   node:18-alpine  171MB
#   node:16-alpine  110MB
#
FROM node:18-alpine

ARG HTTP_SERVER_VER=14.1.1
  # Releases -> https://github.com/http-party/http-server/releases

WORKDIR /work

# Suppress npm update announcements
RUN npm config set update-notifier false

# Install
#
RUN npm install -g http-server@${HTTP_SERVER_VER}

CMD \
  http-server -p ${PORT} /work/public
