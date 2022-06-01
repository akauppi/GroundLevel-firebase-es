# Approach (first deployment)

The aim is to get people to have their first deployment done *fast*. Not needing to learn CI.

<!--
There are multiple hurdles to that.

Tried:

## Skinned down `cloudbuild.yaml`

This *almost* works.

The idea was to avoid `firebase login` and have the manual deployments done by `gcloud`, pretty much how the actual CI/CD would.

Pros:

- could have worked

Cons:

- needs `gcloud` to be installed and authorized, early in the developer experience (in the root `README`; before having looked at the subpackages, for example)

Problems:

- <strike>Our builds require not only Node 16, but also `bash` (and some other tools). We don't have the `firebase-ci-builder` image available, in Cloud Build.</strike>

   >This is likely no longer a problem. Could use DC without `version`..
-->

## Current approach

Have a Docker Compose file that:

- runs locally
- uses `firebase-ci-builder`
- authenticates with `firebase login`

Pros:

- works without changes to the build files
- allows testing, if we'd like to
- keeps Firebase credentials safe; each run requires a new authentication

Cons:

- we don't otherwise deal with `firebase login`

