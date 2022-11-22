# Approach (first deployment)

The aim is to get people to have their first deployment done *fast*. Not needing to learn CI. Not having `gcloud` installed.


## Considerations

Deployment needs to be done with a certain (deployment) Firebase project. We don't want developers to use these projects on a day-to-day basis - CI/CD takes care of it.

We *could* utilize CI/CD scripts also for the initial deployment.

This would mean that the developer needs to have `gcloud` CLI installed. But we'd rather only introduce that in the `/ci/` phase of onboarding.


## Current approach

Have a Docker Compose file that:

- runs locally
- uses `firebase-tools` Docker image
- authenticates with `firebase login`

||
|---|
|**Pros**|
|<font color=green>+ keeps Firebase credentials safe; each run requires a new authentication|
|<font color=green>+ fully separate from the rest of the repo|
|**Cons**|


## Not Modular!

It turns out to be difficult to modularize the `deploy.sh`. 

The reason is state. Selections like `OVERWRITE` would need to be passed, from initial steps to further down. This makes use of a `Makefile` as the primary platform more complex than the linear shell script.

**No need?**

One reason for modularity would be the ability to deploy front-end separately from the backend. However, if this is a thing, setting up CI environment and *there* running the front-end deploying script would do just that.

Thus, no bother.
