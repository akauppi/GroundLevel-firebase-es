#
# Makefile
#
#   Rebuilding is not as important for 'first' as it is for, say, 'app'. Deployments will likely work just fine with
#	earlier versions, but it is _surprising_ that some earlier version would hang around, nonetheless.
#
#	tbd. Consider using Makefile for the whole of the 'first', and bring a stamping system in, at that time.
#		Note: Do NOT store the stamps in '.state/' that gets cleared after successful deployment. These should
#			remain indefinitely. (e.g. 'tmp/.session' instead of '.state'?)
#
all:
	false

_DC=docker compose

# Stamps for building Docker images, if their recipes change.
#
_FIREBASE_TOOLS_DC=tmp/.stamp.firebase-tools

# A building is needed for all the _final_ DC targets that depend on the external Dockerfile.
$(_FIREBASE_TOOLS_DC): ../dc/firebase-tools/Dockerfile
	$(_DC) build deploy-auth deploy-backend deploy-app
	touch $@

refresh-dc: $(_FIREBASE_TOOLS_DC)

#---
echo:
	@echo A

.PHONY: all \
	refresh-dc \
	echo
