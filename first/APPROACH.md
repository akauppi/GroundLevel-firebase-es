# Approach (first deployment)

The aim is to get people to have their first deployment done *fast*. Not needing to learn CI.


## Considerations

Deployment needs to be done with a certain (deployment) Firebase project. We don't want developers to use these projects on a day-to-day basis - CI/CD takes care of it.

We *could* utilize CI/CD scripts also for the initial deployment.

This would mean that the developer needs to have `gcloud` CLI installed. But we'd rather only introduce that in the `/ci/` phase of onboarding.


## Current approach

Have a Docker Compose file that:

- runs locally
- uses `firebase-ci-builder`
- authenticates with `firebase login`

||
|---|
|**Pros**|
|<font color=green>+ keeps Firebase credentials safe; each run requires a new authentication|
|<font color=green>+ fully separate from the rest of the repo|
|**Cons**|
|<font color=red>- we don't otherwise deal with `firebase login`|

