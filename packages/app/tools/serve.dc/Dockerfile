#
# Dockerfile for local HTTP serving
#
# Expects:
#   - a folder with web content, mapped to '/work/public'
#   - 'PORT' env.var. (optional; default 8080)
#
# Notes:
#   All we want is a minimal Node.js container (no native compilation tools required). However, such are not widely
#   available, yet (May-2022). Once they are, we could switch to them (maybe ~40MB footprint).
#
#   i.e. this means a Node.js image without the native compilation tools (g++, make, Python).
#
#   Also, the base image could provide a user; we don't need root access.

# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#

# Node images -> https://hub.docker.com/_/node
#   node:18-alpine  171MB
#   node:16-alpine  110MB
#
FROM node:16-alpine

ARG HTTP_SERVER_VER=14.1.0
  # Releases -> https://github.com/http-party/http-server/releases

WORKDIR /work

# Suppress npm update announcements
RUN npm config set update-notifier false

# Install
#
RUN npm install -g http-server@$HTTP_SERVER_VER

# Override
CMD \
  http-server --help
