#
# backend/Makefile
#
_DC_PATH := ../../dc

_EMUL_DC=tmp/.stamp.emul
_EMUL_APP_DC=tmp/.stamp.emul-for-app

JEST := node_modules/.bin/jest

# Sanity checks

ifneq ($(wildcard functions/node_modules/@firebase),)
  $(error FAIL: Files under 'functions/node_modules' are not being used. Please remove that folder.)
endif

_L := firebase-debug.log firestore-debug.log database-debug.log ui-debug.log
_EMUL_LOGS := $(addprefix logs/,$(_L))
_EMUL_APP_LOGS := $(addprefix logs.app/,$(_L))

_DC=docker compose

help:
	@echo "$$help"

define help
make
  install	Install Node dependencies

  test		Run tests

  --- development
  lint		Runs 'eslint' (very noisy, still)

  --- maintenance
  prune		Clear Node dependendies
endef
export help

# Node.js
install:
	npm install

prune:
	npm prune


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

_started: $(_EMUL_DC) $(_EMUL_LOGS) tmp/firebase.json tmp/database.rules.json
	FUNCTIONS_PORT=5002 $(_DC) run --rm warmed-up
	@echo "Firebase Emulators are running. Use 'docker compose down' to bring them down.\n"

#|lint:
#|	@npm run lint
#|	# tbd. eventually, run via DC

# App development
#
# We support it by having a separate configuration (that includes Firebase Auth).
#
app\:start: $(_EMUL_APP_DC) $(_EMUL_APP_LOGS) tmp/firebase.app.json tmp/database.rules.json
	FUNCTIONS_PORT=5003 $(_DC) -f docker-compose.app.yml run --rm emul-for-app-launched
	@echo "Firebase Emulators for the web app are running.\n"

# CI
#

# Misc

# Maintenance
#

# Used for taking 'emul-for-app' down
app\:down:
	FUNCTIONS_PORT=0 docker compose -f docker-compose.app.yml down

_all-down:
	docker compose -f dc.base.yml down --remove-orphans

# logs[.app]/{firebase|firestore|database|ui}-debug.log'
#
$(_EMUL_LOGS) $(_EMUL_APP_LOGS):
	touch $@

tmp/firebase.json: ./firebase.js
	@node --input-type=module -e \"import o from ./$<; console.log(JSON.stringify(o));\" > $@

tmp/firebase.app.json: ./firebase.app.js
	@node --input-type=module -e \"import o from ./$<; console.log(JSON.stringify(o));\" > $@

tmp/firebase.ci.json: ./firebase.ci.js
	@node --input-type=module -e \"import o from ./$<; console.log(JSON.stringify(o));\" > $@

tmp/database.rules.json:
	@echo '{ \"rules\": { \".read\": false, \".write\": false, \"incoming\":{ \"incs\": {\".indexOn\": \"clientTimestamp\"}, \"logs\": {\".indexOn\": \"clientTimestamp\"}, \"obs\": {\".indexOn\": \"clientTimestamp\"}} } }' > $@

# DC rebuild
#
$(_EMUL_DC): $(_DC_PATH)/firebase-tools/Dockerfile
	FUNCTIONS_PORT=0 $(_DC) build emul
	touch $@

$(_EMUL_APP_DC): $(_DC_PATH)/firebase-tools/Dockerfile
	FUNCTIONS_PORT=0 $(_DC) -f docker-compose.app.yml build emul-for-app
	touch $@

#---
echo:
	@echo $(_EMUL_LOGS)

.PHONY: help \
  install prune \
  test \
  start _started \
  echo
