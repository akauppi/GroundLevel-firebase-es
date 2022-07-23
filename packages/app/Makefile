#
# Makefile
#
# Maintenance chores, for now.
#
all:
	false

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

tmp/.stamp.build: tools/vite.dc/Dockerfile
	RELEASE=abc ENV=def docker compose -f docker-compose.tools.prod.yml build build
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
