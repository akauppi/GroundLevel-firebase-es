#
# Makefile
#
#   Rebuilding is not as important for 'first' as it is for, say, 'app'. Deployments will likely work just fine with
#	earlier versions, but it is _surprising_ that some earlier version would hang around, nonetheless.
#
all:
	false

_DC=docker compose

# Stamps for building Docker images, if their recipes change.
#
_FIREBASE_TOOLS_DC=tmp/.stamp.firebase-tools

# A building is needed for all the _final_ DC targets that depend on the external Dockerfile.
$(_FIREBASE_TOOLS_DC): _needs_dc ../dc/firebase-tools/Dockerfile
	$(_DC) build deploy-auth deploy-backend deploy-app
	touch $@

tmp/functions/.env: ./Makefile
	echo "PROM_USER_ID=0\nLOKI_USER_ID=0" > $@

tmp/firebase.app.prod.json: ../packages/backend/firebase.app.js
	@node --input-type=module -e "import o from '$<'; console.log(JSON.stringify( {...o, emulators: undefined } ));" > $@

refresh-dc: $(_FIREBASE_TOOLS_DC)

_needs_dc:
	@docker --version > /dev/null || ( >&2 echo "PROBLEM: 🐋 Not seeing Docker around, please launch it.\n"; false )

#---
echo:
	@echo "PROM_USER_ID=0\nLOKI_USER_ID=0"

.PHONY: all \
  refresh-dc \
  _needs_dc \
  echo
