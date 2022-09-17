#
# Makefile
#
#	make dev
#	make dev:online
#	[ENV=...] make build
#	make serve
#
all:
	false

ENV ?= staging
_ENV_PROD=.env.$(ENV)
_FIREBASE_PROD_JS=../../firebase.$(ENV).js

_ENV_DEV_LOCAL=.env.dev_local
_ENV_DEV_ONLINE=.env.dev_online

_STATS_HTML=stats.html
  # output from a build

_VITE_DEV_DC=tmp/.stamp.vite-dev
_VITE_ONLINE_DC=tmp/.stamp.vite-online
_PRIME_DC=tmp/.stamp.prime
_BUILD_DC=tmp/.stamp.build
_SERVE_DC=tmp/.stamp.serve

_CYPRESS=node_modules/.bin/cypress

#--- Dev:local
dev: $(_VITE_DEV_DC) $(_ENV_DEV_LOCAL) _emulPrimed
	PORT=3000 docker compose -f docker-compose.local.yml run --rm --service-ports vite-dev

# Make sure emulators are running, with data primed for 'dev' and 'test'
_emulPrimed: $(_PRIME_DC) _emulRunning
	docker compose -f docker-compose.tools.local.yml run --rm prime

# Make sure emulators are running
_emulRunning:
	(cd ../backend && npm run app:start)

#--- Dev:online
dev\:online: $(_VITE_ONLINE_DC) $(_ENV_DEV_ONLINE) $(_FIREBASE_PROD_JS)
	PORT=3001 docker compose -f docker-compose.online.yml run --rm --service-ports vite-online

#--- Test

# tbd. 'PORT' from a file (make loading the Makefile load those)
test: $(_VITE_DEV_DC) $(_CYPRESS) $(_ENV_DEV_LOCAL) _emulPrimed
	PORT=3002 docker compose -f docker-compose.local.yml run --rm vite-dev-launched
	CYPRESS_defaultCommandTimeout=10000 \
      CYPRESS_baseUrl=http://localhost:3002 $(_CYPRESS) run

$(_CYPRESS):
	$(error No 'cypress' command found!)

#--- Build
build: $(_BUILD_DC) $(_ENV_PROD) $(_STATS_HTML) $(_FIREBASE_PROD_JS)
	RELEASE=manual ENV=$(ENV) docker compose -f docker-compose.tools.prod.yml run --rm build

#--- Serve
serve: $(_SERVE_DC)
	docker compose -f dc.prod.serve.yml run --rm --service-ports serve

#--- Build DC images
#
# Note: Each DC container using a certain Dockerfile (e.g. 'tools/vite.dc/Dockerfile') must be separately built, if the
# 	underlying Dockerfile changes. 'docker compose up' has a build option; 'docker compose run' doesn't (that's why
#	we need to do this ourselves; otherwise changes to Dockerfile's would not take effect, which is confusing).
#
$(_VITE_DEV_DC): tools/vite.dc/Dockerfile
	PORT=0 docker compose -f docker-compose.local.yml build vite-dev
	touch $@

$(_VITE_ONLINE_DC): tools/vite.dc/Dockerfile
	PORT=0 docker compose -f docker-compose.online.yml build vite-online
	touch $@

# tbd. Add all 'tools/prime.dc/**' as the triggers
#
$(_PRIME_DC): tools/prime.dc/Dockerfile
	docker compose -f docker-compose.tools.local.yml build prime
	touch $@

$(_BUILD_DC): tools/vite.dc/Dockerfile
	RELEASE=abc ENV=def docker compose -f dc.prod.yml build build
	@touch $@

$(_SERVE_DC): tools/serve.dc/Dockerfile
	docker compose -f docker-compose.tools.serve.yml build serve
	@touch $@

#---
# Ensure files exist, before launching DC.
$(_ENV_PROD) $(_ENV_DEV_LOCAL) $(_ENV_DEV_ONLINE) $(_STATS_HTML):
	@touch $@

$(_FIREBASE_PROD_JS):
	$(error '$(_FIREBASE_PROD_JS)' is missing; see root 'README.md' on how to create one)

#--- Maintenance

# Take possibly running DC images down
#down:
#	#(cd ../backend && npm run app:down)		# tbd. make using Makefile also there
#	false

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
  dev _emulPrimed _emulRunning \
  test \
  build \
  serve
