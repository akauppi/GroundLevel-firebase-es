#
# ci/Makefile
#
all:
	false

pre: _pre1 _pre2

# Build and push 'firebase-emulators'
_pre1:
	gcloud builds submit --config=pre/cloudbuild.pre.yaml ../dc

# Build and push 'cypress-custom'
_pre2:
	gcloud builds submit --config=pre/cloudbuild.pre2.yaml ../packages/app/tools/cypress.dc

#---
.PHONY:
	all \
	pre _pre1 _pre2
