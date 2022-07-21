#
# Makefile
#
help:
	@echo ""
	@echo "make"
	@echo "   list-new     # [maintenance] help finding npm dependencies that have more recent versions available"
	@echo ""

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

#---

.PHONY: help \
	list-new
