#
# Makefile
#
#	make dev
#	make dev:online
#	[ENV=...] make build
#	make serve
#
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
_ENV_PROD=tmp/.env.$(ENV)
_ENV_CI_TEST=tmp/.env.ci_test

# Custom environment additions (not needed for local/CI)
_CUSTOM_ENV_ONLINE=.env.dev.$(ENV)

_DC=docker compose

all:
	false

install:
	npm install --omit=optional --omit=peer

#--- Dev:local
dev: $(_VITE_DEV_DC) $(_ENV_LOCAL) _emulPrimed
	PORT=3000 $(_DC) -f docker-compose.local.yml run --rm --service-ports vite-dev

# DEBUG
\:up: $(_VITE_DEV_DC) $(_ENV_LOCAL) _emulPrimed
	PORT=3000 $(_DC) -f docker-compose.local.yml up vite-dev

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

# Note: 'make test' doesn't need priming; that's for 'make dev'.
#
test: $(_VITE_DEV_DC) $(_CYPRESS_DC) $(_ENV_TEST) _emulRunning
	PORT=3005 $(_DC) -f dc.cypress.yml run --rm run_tests
	@# The port number doesn't really matter (not exposed to the host)

# tbd. 'PORT' from a file (make loading the Makefile load those)

#--- Lint

dev\:lint: ../../node_modules/.bin/eslint
	@../../node_modules/.bin/eslint --ext .js,.vue src || true
	# tbd. eventually, run via DC (and keep separate native target for CI, in 'package.json')

#--- Build
build: $(_BUILD_DC) $(_STATS_HTML) $(_FIREBASE_PROD_JS)
	RELEASE=manual ENV=$(ENV) $(_DC) -f docker-compose.tools.prod.yml run --rm build

#--- Serve
serve: $(_SERVE_DC)
	$(_DC) -f dc.prod.serve.yml run --rm --service-ports serve

#--- Vite environments
#
$(_ENV_LOCAL): tools/gen-vite-env-local.js ../backend/firebase.app.js
	EMUL_HOST=localhost node $< --project=demo-main > $@
	@# no override needed

$(_ENV_ONLINE): tools/gen-vite-env-online.js $(_CUSTOM_ENV_ONLINE) ../../firebase.$(ENV).js
	ENV=$(ENV) node $< > $@
	cat $(_CUSTOM_ENV_ONLINE) >> $@

$(_ENV_TEST): tools/gen-vite-env-local.js ../backend/firebase.app.js
	EMUL_HOST=emul-for-app node $< --project=demo-main > $@
	@# no override needed

$(_ENV_PROD): tools/gen-vite-env-prod.js $(_CUSTOM_ENV)
	ENV=$(ENV) node $< > $@
	cat $(_CUSTOM_ENV) >> $@

$(_ENV_CI_TEST): tools/gen-vite-env-local.js ../backend/firebase.app.ci.js ../backend/firebase.ci.js ../backend/firebase.app.js
	FIREBASE_APP_JS=../backend/firebase.app.ci.js EMUL_HOST=emul-for-app node $< --project=demo-main > $@
	@# no override needed

# If no custom env file, use a template.
#
$(_CUSTOM_ENV_ONLINE) $(_CUSTOM_ENV): optional.env.txt
	@cp $< $@

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

# Any change to 'tools/prime.dc/**' triggers a build
#
$(_PRIME_DC): tools/prime.dc/Dockerfile $(shell find tools/prime.dc -type f)
	$(_DC) -f docker-compose.tools.local.yml build prime
	touch $@

$(_BUILD_DC): tools/vite.dc/Dockerfile
	@RELEASE=abc ENV=def $(_DC) -f docker-compose.tools.prod.yml build build
	@touch $@

$(_SERVE_DC): tools/serve.dc/Dockerfile
	$(_DC) -f docker-compose.tools.serve.yml build serve
	@touch $@

$(_CYPRESS_DC): tools/cypress.dc/Dockerfile #tools/cypress.dc/package.json
	VITE_URL="" PORT=0 $(_DC) -f dc.cypress.yml build run_tests
	@touch $@

#---
# Ensure files exist, before launching DC.
#
$(_STATS_HTML):
	@touch $@

$(_FIREBASE_PROD_JS):
	$(error '$(_FIREBASE_PROD_JS)' is missing; see root 'README.md' on how to create one)

#--- Misc
firebase.json: firebase.hosting.js
	@node --input-type=module -e "import o from './$<'; console.log(JSON.stringify(o, null, 2));" > $@

#--- CI
tmp/firebase.app.ci.js: ../backend/firebase.app.ci.js ../backend/firebase.ci.js ../backend/firebase.app.js
	@node --input-type=module -e "import o from './$<'; console.log('export default '+ JSON.stringify(o));" > $@

#---
# Cypress on Windows + WSL2: Prepare the visibility of Node modules so that 'cypress open' process can see them.
#
prep-cy-open:
	ln -s -f /usr/lib/node_modules/cypress node_modules/
	ln -s -f $(PWD)/../backend/node_modules/firebase-admin node_modules/

#--- Maintenance

# Take possibly running DC images down
#
# All services we have share the project name ('app') with the 'dc.base.yml'. Also the backend (which is in '../backend')
# shares that name. This means '--remove-orphans' brings them down (without needing to list all '.yml' files here).
#
down-all:
	PORT=0 $(_DC) -f dc.base.yml down --remove-orphans
	PORT=0 $(_DC) -f dc.cypress.yml down --remove-orphans

#--- Global checks

# Check no 'esbuild' (and 'vite') installed
ifneq ($(wildcard node_modules/esbuild),)
  $(error INTERNAL: 'node_modules/esbuild*' shouldn't be there; please remove them. (rm -rf node_modules/esbuild*))
endif

#---
echo:
	@echo $(shell find tools/prime.dc -type f)

.PHONY: all echo \
  dev _emulPrimed _emulRunning \
  test \
  build \
  serve \
  down-all \
  prune
