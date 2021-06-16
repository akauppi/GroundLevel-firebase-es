#!/bin/bash
set -eu -o pipefail

#
# Run Cloud Build manually (when developing the `.yaml` files)
#
# Requires:
#   - gcloud
#   - you to have logged in to the CI project (`gcloud auth login`)
#
usage() { >&2 echo "Usage: manual-build [backend|app]"; exit 1; }

case "${1-}" in
  app | backend) ;;
  *) usage; ;;
esac

_CMD="gcloud builds submit --config=cloudbuild.master-pr.${1}.yaml .."
echo "$_CMD"
echo
$_CMD
