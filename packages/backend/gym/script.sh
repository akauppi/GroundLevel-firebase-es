#!/bin/sh
#
# Gym for exercising the deployed 'metrics-and-logging-proxy-v0', from command line.
#
# Usage:
#   $ EMUL_HOST=... $@

# NOTE! Until "v2" supports 'cloudfunctions.net' URLs, they are one off (created at the deployment, then stable, but
#     bot predictable):
#
CALLABLE_URL=https://metrics-and-logging-proxy-v0-lhnzrejgbq-lm.a.run.app
  #
  # was: http://${EMUL_HOST:-localhost}:5003/demo-main/us-central1/metrics-and-logging-proxy-v0

# Project id 'demo-main' and uid 'goofy' are baked into the token (nothing secret).
#
#TOKEN=eyJhbGciOiJub25lIiwia2lkIjoiZmFrZWtpZCIsInR5cGUiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZGVtby1tYWluIiwiYXVkIjoiZGVtby1tYWluIiwiaWF0IjowLCJleHAiOjM2MDAsImF1dGhfdGltZSI6MCwic3ViIjoiZ29vZnkiLCJ1c2VyX2lkIjoiZ29vZnkiLCJmaXJlYmFzZSI6eyJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIiwiaWRlbnRpdGllcyI6e319fQ.

TOKEN=eyJhb...

curl -X POST -v -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  ${CALLABLE_URL} \
  -d '{ "data": {"arr": [{ "id": "a", "inc": 0.1, "ctx": { "clientTimeStamp": 123, "uid": "goofy" }}]} }'
