# Wishes for Cloud Build


## Running CI tests with Docker Compose (give just one sample..)

This was **painful**. 🥊👿👹🗡⚔️

Cloud Build documentation says this on its front page:

>Each build step is run with its container attached to a local Docker network named `cloudbuild`. This allows build steps to communicate with each other and share data.

However, it doesn't provide any samples.

None of the GCP Cloud Build samples mention `network_mode`.

It was due to this **singular** [StackOverflow entry](https://stackoverflow.com/a/57835293/14455) that the author figured, how to use Cloud Build and DC together:

```
network_mode: cloudbuild
container_name: redis
```

Creating a network is not necessary (other samples having that likely do so, in order to be able to be run locally, as well).

The `container_name` was something the author hadn't figured out.

---

The benefit we get is that:

- DC can launch the elaborate services in the background
- test steps can behave normal, like:

```
- name: node:16
  entrypoint: npm
  args: ['run', 'ci:test']
  dir: packages/backend
  env: ['EMUL_HOST=emul']
```

Just... *MAKE IT VISIBLE IN SAMPLES*. Thanks.



## `<<: &npmStep` - YAML anchors et.al.?

The YAML anchors and references don't seem to be supported by `gcloud beta builds submit`.

They would be useful in keeping build definitions DRY:


```
# - when push or PR targeting 'master'
#   - if changes in 'packages/backend' (other than '.md' or '.images'):
#     - cd packages/backend
#     - npm install
#     - npm test
#     - npm run deploy

_:
  <<: &npmStep
    name: eu.gcr.io/groundlevel-160221/firebase-custom-builder
    entrypoint: npm

steps:
  - <<: *npmStep
    args: ['install']
    dir: packages/backend
  - <<: *npmStep
    args: ['test']
    dir: packages/backend
  - <<: *npmStep
    args: ['run deployyyy']
    dir: packages/backend
```

Instead of repeating the long, custom image name, we could define a step from it.

Tried:

```
ERROR: (gcloud.beta.builds.submit) interpreting cloudbuild.yaml as build config: ._: unused
```

Tried other ways as well. To me, it seems the YAML parser is not capable of expanding the `&npmStep` (anchor) and `*npmStep` (reference). Maybe it is a matter of just configuring it, so it can? 

Beta v. 2021.03.19


## Regional builds

As described in [FR: Select build region](https://issuetracker.google.com/issues/63480105) (Google IssueTracker)

The slowness of image pull seems a bit ridiculous. This would likely help, plus simply make things "more local" for people in EU / Asia corners of the world.

*tbd. list how long it takes for Cloud Build to pull the custom builder (once per build)*


## Caching Docker Compose builds

The `ci/cloudbuild.master-pr.backend.yaml` now starts to be "production ready". Most of its time is spent either fetching images, or building those - it uses the `builds:` definition of Docker Compose.

Subsequent CI runs do all of this anew. 

The Kaniko caching provided by Google for building *Docker images* (running Docker itself) is not applicable here, because we cannot enable it for Docker Compose.

Could that be done?

- caching `builds:` results of `docker/compose` steps, within Cloud Build
- caching images pulled by `docker/compose` steps, within Cloud Build 

