#
# Makefile
#
#   Rebuilding is not as important for 'first' as it is for, say, 'app'. Deployments will likely
#	work just fine with earlier versions, but it is _surprising_ that some earlier version would hang
#	around, nonetheless.
#
#	tbd. Consider using Makefile for the whole of the 'first', and bring a stamping system in, at that time.
#		Note: Do NOT store the stamps in '.state/' that gets cleared after successful deployment. These should
#			remain indefinitely. (e.g. 'tmp/.session' instead of '.state'?)
#
all:
	false

#tmp/.stamp.vite-dev: tools/vite.dc/Dockerfile
#	docker compose build vite-dev
#	touch $@

# Keyed by their DC container names
#
#refresh-xxxvite-dev: tmp/.stamp.vite-dev

refresh-deploy-auth:

refresh-deploy-backend:

refresh-deploy-app:

#---
.PHONY: all refresh-deploy-auth refresh-deploy-backend refresh-deploy-app
