#
# Makefile
#
all:
	false

DC_PATH := ../../dc

DC := docker compose

#
# When '/dc/firebase-{emulators|tools}' contents change, *each* DC container using it needs to be separately rebuilt.
#
# The targets are by their DC container names.
#
tmp/.stamp.emul: ${DC_PATH}/firebase-tools/Dockerfile
	LOGS_PATH= FUNCTIONS_PORT=0 docker compose build emul
	touch $@

tmp/.stamp.emul-for-app: ${DC_PATH}/firebase-tools/Dockerfile
	LOGS_PATH= DOT_APP= FUNCTIONS_PORT=0 docker compose -f docker-compose.app.yml build emul-for-app
	touch $@

refresh-emul: tmp/.stamp.emul

refresh-emul-for-app: tmp/.stamp.emul-for-app

#refresh-all: refresh-emul refresh-emul-for-app

#---
# Undocumented (maintenance/dev)
_down-all:
	LOGS_PATH= FUNCTIONS_PORT=0 $(DC) down
	LOGS_PATH= DOT_APP= FUNCTIONS_PORT=0 $(DC) -f docker-compose.app.yml down

#---
.PHONY: all \
  refresh-emul refresh-emul-for-app refresh-all
