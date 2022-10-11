#
# ci/Makefile
#

all:
	false

pre:
	@$(MAKE) _pre-firebase-tools _pre-cypress-custom

# Build and push 'firebase-emulators'
_pre-firebase-tools:
	gcloud builds submit --config=cloudbuild.pre.yaml ../dc

# Build and push 'cypress-custom'
_pre-cypress-custom:
	gcloud builds submit --config=cloudbuild.pre2.yaml ../packages/app/tools/cypress.dc

#---
.PHONY:
	all \
	pre _pre-firebase-tools _pre-cypress-custom
