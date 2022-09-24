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

_FIREBASE_PROD_JS=../../firebase.$(ENV).js
_STATS_HTML=stats.html
  # output from a build

_VITE_DEV_DC=tmp/.stamp.vite-dev
_VITE_ONLINE_DC=tmp/.stamp.vite-online
_PRIME_DC=tmp/.stamp.prime
_BUILD_DC=tmp/.stamp.build
_SERVE_DC=tmp/.stamp.serve
_CYPRESS_DC=tmp/.stamp.cypress

# 'tmp/.env**' files that steer Vite
#
_ENV_LOCAL=tmp/.env.dev_local
_ENV_ONLINE=tmp/.env.dev.$(ENV)
_ENV_TEST=tmp/.env.dev_test
#_ENV_CI=tmp/.env.ci
_ENV_PROD=tmp/.env.$(ENV)

# Custom environment additions (not needed for local/CI)
_CUSTOM_ENV_ONLINE=.env.dev.$(ENV)
_CUSTOM_ENV_PROD=.env.$(ENV)

_DC=docker compose

#--- Dev:local
dev: $(_VITE_DEV_DC) $(_ENV_LOCAL) _emulPrimed
	PORT=3000 $(_DC) -f docker-compose.local.yml run --rm --service-ports vite-dev

# Make sure emulators are running, with data primed for 'dev' and 'test'
_emulPrimed: $(_PRIME_DC) _emulRunning
	$(_DC) -f docker-compose.tools.local.yml run --rm prime

# Make sure emulators are running
_emulRunning:
	(cd ../backend && $(MAKE) app:start)

#--- Dev:online
dev\:online: $(_VITE_ONLINE_DC) $(_ENV_ONLINE) $(_FIREBASE_PROD_JS)
	PORT=3001 $(_DC) -f docker-compose.online.yml run --rm --service-ports vite-online

#--- Test

# tbd. 'PORT' from a file (make loading the Makefile load those)
test: $(_VITE_DEV_DC) $(_CYPRESS_DC) $(_ENV_TEST) _emulPrimed
	PORT=3002 $(_DC) -f docker-compose.test.yml run --rm vite-dev-launched
	VITE_URL=http://vite-dev:3002 $(_DC) -f dc.cypress.yml run --rm run_tests

# tbd. 'PORT' from a file (make loading the Makefile load those)

#--- Build
build: $(_BUILD_DC) $(_ENV_PROD) $(_STATS_HTML) $(_FIREBASE_PROD_JS)
	RELEASE=manual ENV=$(ENV) $(_DC) -f docker-compose.tools.prod.yml run --rm build

#--- Serve
serve: $(_SERVE_DC)
	$(_DC) -f dc.prod.serve.yml run --rm --service-ports serve

#--- Vite environments
#
$(_ENV_LOCAL): tools/gen-vite-env-local.js ../backend/firebase.app.js
	EMUL_HOST=localhost node $< --project=demo-main > $@
	@# no override needed

$(_ENV_ONLINE): tools/gen-vite-env-online.js $(_CUSTOM_ENV_ONLINE)
	node $< > $@
	cat $(_CUSTOM_ENV_ONLINE) >> $@

$(_ENV_TEST): tools/gen-vite-env-local.js ../backend/firebase.app.js
	EMUL_HOST=emul-for-app node $< --project=demo-main > $@
	@# no override needed

#$(_ENV_CI): tools/gen-vite-env-ci.js
#	node $< --project=demo-main > $@

$(_ENV_PROD): $(_CUSTOM_ENV_PROD)
	false

$(_CUSTOM_ENV_ONLINE) $(_CUSTOM_ENV_PROD):
	@touch $@

#--- Build DC images
#
# Note: Each DC container using a certain Dockerfile (e.g. 'tools/vite.dc/Dockerfile') must be separately built, if the
# 	underlying Dockerfile changes. 'docker compose up' has a build option; 'docker compose run' doesn't (that's why
#	we need to do this ourselves; otherwise changes to Dockerfile's would not take effect, which is confusing).
#
$(_VITE_DEV_DC): tools/vite.dc/Dockerfile
	PORT=0 $(_DC) -f docker-compose.local.yml build vite-dev
	touch $@

$(_VITE_ONLINE_DC): tools/vite.dc/Dockerfile
	PORT=0 $(_DC) -f docker-compose.online.yml build vite-online
	touch $@

# tbd. Add all 'tools/prime.dc/**' as the triggers
#
$(_PRIME_DC): tools/prime.dc/Dockerfile
	$(_DC) -f docker-compose.tools.local.yml build prime
	touch $@

$(_BUILD_DC): tools/vite.dc/Dockerfile
	RELEASE=abc ENV=def $(_DC) -f docker-compose.tools.prod.yml build build
	@touch $@

$(_SERVE_DC): tools/serve.dc/Dockerfile
	$(_DC) -f docker-compose.tools.serve.yml build serve
	@touch $@

$(_CYPRESS_DC): tools/cypress.dc/Dockerfile #tools/cypress.dc/package.json
	VITE_URL="" $(_DC) -f dc.cypress.yml build run_tests
	@touch $@

#---
# Ensure files exist, before launching DC.
#
$(_STATS_HTML):
	@touch $@

$(_FIREBASE_PROD_JS):
	$(error '$(_FIREBASE_PROD_JS)' is missing; see root 'README.md' on how to create one)

#--- Maintenance

# Take possibly running DC images down
_all-down:
	PORT=0 docker compose -f dc.base.yml down --remove-orphans
	(cd ../backend && make app:down)

prune:
	npm prune
	rm -rf node_modules/esbuild node_modules/vite

#--- Global checks

# Check no 'esbuild' (and 'vite') installed
ifneq ($(wildcard node_modules/esbuild),)
  $(error INTERNAL: 'node_modules/esbuild*' shouldn't be there; please remove them. (rm -rf node_modules/esbuild*))
endif

#---
echo: a b
	@echo $<

.PHONY: all echo \
  dev _emulPrimed _emulRunning \
  test \
  build \
  serve \
  prune
