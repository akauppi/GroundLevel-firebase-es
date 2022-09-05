#
# Makefile
#
#	[ENV=...] make build
#	make serve
#
all:
	false

# 'ENV' provides the production stage name.
ENV ?= staging
_ENV_PROD=.env.$(ENV)
_FIREBASE_PROD_JS=../../firebase.$(ENV).js

_STATS_HTML=stats.html
  # output from a build

_SERVE_DC=tmp/.stamp.serve
_BUILD_DC=tmp/.stamp.build

#--- Build
build: $(_BUILD_DC) $(_ENV_PROD) $(_STATS_HTML) $(_FIREBASE_PROD_JS)
	RELEASE=manual ENV=$(ENV) docker compose -f docker-compose.tools.prod.yml run --rm build

$(_BUILD_DC): tools/vite.dc/Dockerfile
	RELEASE=abc ENV=def docker compose -f docker-compose.tools.prod.yml build build
	@touch $@

#--- Serve
serve: $(_SERVE_DC)
	docker compose -f docker-compose.tools.serve.yml run --rm --service-ports serve

$(_SERVE_DC): tools/serve.dc/Dockerfile
	docker compose -f docker-compose.tools.serve.yml build serve
	@touch $@

#---
# Ensure files exist, before launching DC.
$(_ENV_PROD) $(_STATS_HTML):
	@touch $@

$(_FIREBASE_PROD_JS):
	$(error '$(_FIREBASE_PROD_JS)' is missing; see root 'README.md' on how to create one)

#--- Global checks

# Check no 'esbuild' (and 'vite') installed
ifneq ($(wildcard node_modules/esbuild),)
  $(error INTERNAL: 'node_modules/esbuild*' shouldn't be there; please remove them. (rm -rf node_modules/esbuild*))
endif

#---
echo:
	#@echo $(_ENV_PROD)
	#@echo $(wildcard node_modules/dayjs)

.PHONY: all echo \
  build \
  serve

#---

#
# When 'tools/vite.dc/Dockerfile' changes, *each* DC container using it needs to be separately rebuilt (rebuilding the
# base does not have an effect; Docker Compose 2.6.1).
#
tmp/.stamp.vite-dev: tools/vite.dc/Dockerfile
	PORT=0 docker compose -f docker-compose.local.yml build vite-dev
	touch $@

tmp/.stamp.vite-online: tools/vite.dc/Dockerfile
	PORT=0 docker compose -f docker-compose.online.yml build vite-online
	touch $@

# tbd. Prime stamp should have also all 'tools/prime.dc/**' as its triggers
#
tmp/.stamp.prime: tools/prime.dc/Dockerfile
	docker compose -f docker-compose.tools.local.yml build prime
	touch $@

# Keyed by their DC container names
#
refresh-vite-dev: tmp/.stamp.vite-dev

refresh-vite-online: tmp/.stamp.vite-online

refresh-build: tmp/.stamp.build

refresh-prime: tmp/.stamp.prime

#refresh: refresh-vite-dev refresh-vite-online refresh-build refresh-prime

#refresh-force:
#	rm tmp/.stamp.vite.dc
#	$(MAKE) refresh

#---
.PHONY: all refresh
