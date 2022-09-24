#
# Makefile
#
help:
	@echo ""
	@echo "make"
	@echo "   list-new     # [maintenance] help finding npm dependencies that have more recent versions available"
	@echo "   de-brand     # Removes GroundLevel images from the repo (to be run when you start using it with your own web app)"
	@echo ""

install:
	npm install

# List possibly outdated dependencies, in all the subpackages.
#
list-new:
	@set -eu; \
	PATHS=". packages/backend packages/backend/functions packages/app"; \
	for _PATH in $$PATHS; do \
	  printf "\n*** $$_PATH ***\n"; \
	  npm --prefix "$$_PATH" outdated || true ; \
	done
	@echo ""

	@# 'npm ... outdated' (npm 8.0.0) exits with non-0 if there are outdated entries. That's why '|| true'.

# Remove GroundLevel graphics
#
# Note:
#	This does NOT remove mentions of 'GroundLevel'
#	Also, you should manually edit the License
#
de-brand:
	git rm -rf branding

#---

.PHONY: help \
	list-new \
	de-brand
