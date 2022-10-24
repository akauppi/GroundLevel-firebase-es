#
# backend/Makefile
#
_DC_PATH := ../../dc

_EMUL_DC=tmp/.stamp.emul
_EMUL_APP_DC=tmp/.stamp.emul-for-app

JEST := node_modules/.bin/jest

_L := firebase-debug.log firestore-debug.log database-debug.log ui-debug.log
_EMUL_LOGS := $(addprefix logs/,$(_L))
_EMUL_APP_LOGS := $(addprefix logs.app/,$(_L))

_DC=docker compose

#---
# Read ports from 'firebase{|.app}.js'.
#
# Note: While copy-pasting the port numbers wouldn't be harmful as such (they don't need to change), having a single
#		source of truth is way cleaner, and better for maintainability.
#
_FIREBASE_JS='firebase.js'

_FIRESTORE_PORT=$(shell node tools/fireport.js $(_FIREBASE_JS) firestore)
_FUNCTIONS_PORT=$(shell node tools/fireport.js $(_FIREBASE_JS) functions)
_UI_PORT=$(shell node tools/fireport.js $(_FIREBASE_JS) ui)

_DC_PORTS = FIRESTORE_PORT=$(_FIRESTORE_PORT) FUNCTIONS_PORT=$(_FUNCTIONS_PORT) UI_PORT=$(_UI_PORT) \
  $(_DC)

# Also app needs the same treatment, not because of 'make test' but Desktop Cypress use case.
#
_FIREBASE_APP_JS='firebase.app.js'

_FIRESTORE_APP_PORT=$(shell node tools/fireport.js $(_FIREBASE_APP_JS) firestore)
_DATABASE_APP_PORT=$(shell node tools/fireport.js $(_FIREBASE_APP_JS) database)
_FUNCTIONS_APP_PORT=$(shell node tools/fireport.js $(_FIREBASE_APP_JS) functions)
_AUTH_APP_PORT=$(shell node tools/fireport.js $(_FIREBASE_APP_JS) auth)
_UI_APP_PORT=$(shell node tools/fireport.js $(_FIREBASE_APP_JS) ui)

_DC_APP_PORTS = FIRESTORE_PORT=$(_FIRESTORE_APP_PORT) DATABASE_PORT=$(_DATABASE_APP_PORT) FUNCTIONS_PORT=$(_FUNCTIONS_APP_PORT) AUTH_PORT=$(_AUTH_APP_PORT) UI_PORT=$(_UI_APP_PORT) \
  $(_DC)

#---
help:
	@echo "$$help"

define help
make
  install	Install Node dependencies

  test		Run tests

  --- development
  lint		Runs 'eslint' (very noisy, still)

  --- maintenance
endef
export help

# Node.js
install: _uses_docker
	npm install

# Tests
test: _started
	$(MAKE) test:fns:all
	$(MAKE) test:rules:all

test\:fns\:userInfo: tmp/firebase.json
	FIREBASE_JSON=tmp/firebase.json \
	  NODE_OPTIONS=--experimental-vm-modules jest --config test-fns/jest.config.js -f userInfo.test.js --verbose --all

test\:fns\:all: tmp/firebase.json
	FIREBASE_JSON=tmp/firebase.json NODE_OPTIONS=--experimental-vm-modules $(JEST) --config test-fns/jest.config.js --verbose --all

test\:rules\:invites:
	@$(MAKE) SOME=invitesC.test.js _testRulesSome
test\:rules\:projects:
	@$(MAKE) SOME=projectsC/index.test.js _testRulesSome
test\:rules\:projectsSymbols:
	@$(MAKE) SOME=projectsC/symbolsC.test.js _testRulesSome
test\:rules\:projectsUserInfo:
	@$(MAKE) SOME=projectsC/userInfoC.test.js _testRulesSome
test\:rules\:userInfo:
	@$(MAKE) SOME=userInfoC.test.js _testRulesSome
_testRulesSome:	tmp/firebase.json
	FIREBASE_JSON=tmp/firebase.json \
	  NODE_OPTIONS=--experimental-vm-modules $(JEST) --config test-firestore-rules/jest.config.js -f $(SOME) --verbose --all

test\:rules\:all: tmp/firebase.json
	FIREBASE_JSON=tmp/firebase.json \
	  NODE_OPTIONS=--experimental-vm-modules $(JEST) --config test-firestore-rules/jest.config.js --verbose --detectOpenHandles --all

# Database
test\:rules2\:logging: tmp/firebase.json
	FIREBASE_JSON=tmp/firebase.json NODE_OPTIONS=--experimental-vm-modules $(JEST) --config test-database/jest.config.js -f logging.test.js --verbose --detectOpenHandles --all

test\:rules2\:all: tmp/firebase.json
	FIREBASE_JSON=tmp/firebase.json NODE_OPTIONS=--experimental-vm-modules $(JEST) --config test-database/jest.config.js --verbose --detectOpenHandles --all


# Development
start: _started

_started: $(_EMUL_DC) $(_EMUL_LOGS) tmp/firebase.json
	$(_DC_PORTS) run --rm warmed-up
	@echo "Firebase Emulators are running. Use 'docker compose down' to bring them down.\n"

# DEBUG
\:up: $(_EMUL_DC) $(_EMUL_LOGS) tmp/firebase.json
	$(_DC_PORTS) up warm-up

#|lint:
#|	@npm run lint
#|	# tbd. eventually, run via DC

# App development
#
# We support it by having a separate configuration (that includes Firebase Auth).
#
app\:start: $(_EMUL_APP_DC) $(_EMUL_APP_LOGS) tmp/firebase.app.json database.rules.app.json
	COMPOSE_IGNORE_ORPHANS=true $(_DC_APP_PORTS) -f docker-compose.app.yml run --rm emul-for-app-warmed-up
	@echo "Firebase Emulators for the web app are running.\n"

# DEBUG
\:app\:up: $(_EMUL_APP_DC) $(_EMUL_APP_LOGS) tmp/firebase.app.json database.rules.app.json
	COMPOSE_IGNORE_ORPHANS=true $(_DC_APP_PORTS) -f docker-compose.app.yml up emul-for-app

# CI
#
ci\:deploy\:firebase.json: firebase.app.js
	@node --input-type=module -e "import o from './$<'; console.log(JSON.stringify({...o, emulators: undefined}));" > firebase.json

# Flatten 'firebase.ci.js' so that its dependencies are no longer needed in DC mapping
#
tmp/firebase.ci.js: ./firebase.ci.js ./firebase.app.js
	@node --input-type=module -e "import o from './$<'; console.log('export default '+ JSON.stringify(o));" > $@

# Misc

# Maintenance
#
_ALL_PORTS_DUMMY := FIRESTORE_PORT=10001 FUNCTIONS_PORT=10002 DATABASE_PORT=10003 AUTH_PORT=10004 UI_PORT=10005

down-all:
	docker compose -f dc.base.yml down --remove-orphans

# logs[.app]/{firebase|firestore|database|ui}-debug.log'
#
$(_EMUL_LOGS) $(_EMUL_APP_LOGS):
	touch $@

tmp/firebase.json: ./firebase.js
	@node --input-type=module -e "import o from './$<'; console.log(JSON.stringify(o));" > $@

tmp/firebase.app.json: ./firebase.app.js
	@node --input-type=module -e "import o from './$<'; console.log(JSON.stringify(o));" > $@

tmp/firebase.app.ci.json: ./firebase.app.ci.js ./firebase.ci.js ./firebase.app.js
	@node --input-type=module -e "import o from './$<'; console.log(JSON.stringify(o));" > $@

tmp/firebase.ci.json: ./firebase.ci.js ./firebase.app.js
	@node --input-type=module -e "import o from './$<'; console.log(JSON.stringify(o));" > $@

# DC rebuild
#
$(_EMUL_DC): $(_DC_PATH)/firebase-tools/Dockerfile $(shell find $(_DC_PATH)/firebase-emulators/* -type f)
	$(_ALL_PORTS_DUMMY) $(_DC) build emul
	touch $@

$(_EMUL_APP_DC): $(_DC_PATH)/firebase-tools/Dockerfile $(shell find $(_DC_PATH)/firebase-emulators/* -type f)
	$(_ALL_PORTS_DUMMY) $(_DC) -f docker-compose.app.yml build emul-for-app
	touch $@

# Give nicer error message if Docker is not running.
#
_uses_docker:
	@docker --version > /dev/null || ( >&2 echo "PROBLEM: 🐋 Not seeing Docker around, please launch it.\n"; false )

#---
echo:
	@echo $(wildcard functions/node_modules/*)

.PHONY: help \
  install postinstall-local \
  test \
  start _started \
  app\:start \
  ci\:deploy\:firebase.json \
  down-all \
  _uses_docker \
  echo
