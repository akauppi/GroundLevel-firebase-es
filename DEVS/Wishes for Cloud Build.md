# Wishes for Cloud Build

Cloud Build is amazing, and the best abstraction for CI work the author has tested. Having said that, its current (Aug 2022) *implementation* leaves things to be wished for.

In addition, its dealing with official vs. community vs. public images is *arbitrary, inconsistent, outdated* and plain just a bad idea. This page tries to show how things can be made faster, while reducing the workload Google needs to put into sheparding the images.

---

**First, the image categories** (needed for understanding the rest..)

- Official images - ["Supported builder images provided by Cloud Build"](https://cloud.google.com/build/docs/cloud-builders#supported_builder_images_provided_by)

  These are cool. Example: `gcr.io/cloud-builders/gcloud`

  >Actually, the Docker image is weird in its own way. Is a full Ubuntu-based image really needed, instead of a slimmer Docker-on-Docker one? (Does Cloud Build run Docker underneath?)

   The official images load *instantaneously*, which is their ultimate benefit (in addition to Google presumably auditing their security..).

- Community images - ["Community contributed builders"](https://cloud.google.com/build/docs/cloud-builders#community-contributed_builders)

   These should go. They complicate matters, and are not well maintained. The author does not understand which benefit they carry, over Docker Hub images.
   
   - [`cloud-builders-community`](https://github.com/GoogleCloudPlatform/cloud-builders-community) has the full list. Last changes are 17 months .. 4 years ago. Stale.

   The repo should be **clearly marked as deprecated** and references to it within Google Cloud Platform documentation be removed, or updated accordingly.

   >This already seems to have started. [Build Node.js applications](https://cloud.google.com/build/docs/building/build-nodejs) (Cloud Build guides) states:
   
   >Cloud Build enables you to use any publicly available container image to execute your tasks. The public node image from Docker Hub comes preinstalled with npm and yarn tools. 
      
- Docker Hub images - ["Publicly available images"](https://cloud.google.com/build/docs/cloud-builders#publicly_available_images)

   These work great. Their only downside is that **they get pulled again and again** when one triggers the CI jobs. In this repo's routine CI runs, 20..30% of the time is spent pulling Docker images.
   
   Cloud Build could cache these, per service account or globally. That would reduce the delays without causing people to change their CI scripts. Why not?

- Private Artifact Registry images - ["Writing your own custom builder"](https://cloud.google.com/build/docs/cloud-builders#writing_your_own_custom_builder)

   These are handy, and could also be cached. But the next category may reduce the need for having them.

- Docker Images built within a CI script

   Images that `docker build` or `docker compose` builds, also implicitly.
   
   When using Docker Compose, this may be due to `build: context: <path to Dockerfile> ` declarations (Docker Compose referring to a local Dockerfile).

   ```
   build:
      context: tools/vite.dc
      target: vite_plain
   ```

   Whichever way these are built, it would be welcome if Cloud Build can cache them, automatically, for say, 2 or 24 hours. This would reduce the need to build and push one's private Docker builders, since those could be declared within the repo.
   
   >Note: This repo uses local Docker Compose definitions extensively. Vite and priming are done using such. Study the `packages/app/tools/*.dc` folders to see the details.

---




## Caching Docker images 🔥🔥🔥

Already described above, under "First the image categories", Cloud Build could cache more.

<!-- tbd. A chart about the below (two pies)
-->

Here are the CI job timings (with a hand watch) for testing this repo.

||backend tests|front-end tests|
|---|---|---|
|Pull `node:18-alpine`|8s|7s|
|Pull `docker/compose` and adjacent, e.g. `firebase-emulators`|22s|22s|
|Pull `cypress/included`|--|65s|
|Building and testing|96s|228s|
|---|---|---|
|Whole script length|2m 6s|5m 22s|
|% spent pulling|24%|29%|

### Kaniko is no help

Google Cloud Platform presents [Kaniko](https://cloud.google.com/build/docs/optimize-builds/kaniko-cache) as a solve-all for the Docker caching problems. It's not. At least the author has not figured how it could help him speed the builds.

Kaniko is (only) for building Docker images, and suitable for speedup when the *end result* of the CI job is a Docker image. With this repo, that's not the case. Since Cloud Build doesn't pull images from Kaniko cache itself, Kaniko remains a separate solution.

This could be clearly mentioned in the Google Cloud Build documentation. Currently, the role of Kaniko is not clearly mentioned.

>Kaniko cache is a Cloud Build feature that caches container build artifacts by storing and indexing intermediate layers within a container image registry, such as Google's own Container Registry, where it is available for use Kaniko.

That's a quote from Cloud Build docs.

- It has a weird ending (or typo?)
- It only mentions Container Registry, not Artifact Registry (is this being maintained?)
- The limitations are not mentioned

The author would rewrite it as (this may be wrong!!):

>Kaniko cache is a Cloud Build **step** that caches container build artifacts by storing and indexing intermediate layers within a container image registry, such as <strike>Google's own</strike> Container Registry **or Artifact Registry**, where <strike>it is</strike> **they are** available for use **in future** Kaniko **build steps**.


## Recursive substitutions (syntax)

I'd like this to work:

```
substitutions:
  _A: us-central1-docker.pkg.dev/ci-builder/builders/firebase-emulators:${_VER}
  _VER: 11.3.0
```

i.e. if there's a `${_...}` within the value of a substitution definition, it would use the value of such other substitution.

Not a big thing.


## Better documentation: interacting between Cloud Build steps, using Docker

This is possible, and *highly useful*, but not clearly documented. It was by persistence and luck that the author finally got it to work.

Things don't deserve to be that way. The pattern is:

- launch a service, within Cloud Build, in the background (a port remains open)
- run tests against such a service (in another step)

Sounds simple.

>This was **painful**. 🥊👿👹🗡⚔️

**Current advice**

Cloud Build documentation says this on its [front page](https://cloud.google.com/build/docs/overview):

>Each build step is run with its container attached to a local Docker network named `cloudbuild`. This allows build steps to communicate with each other and share data.

The only sample it gives is about [building a Docker image](https://cloud.google.com/build/docs/build-config-file-schema#network). The author doesn't see the point of that sample.

**Could be...**

None of the GCP Cloud Build samples mention `network_mode`.

It was due to this **singular** [StackOverflow entry](https://stackoverflow.com/a/57835293/14455) that the author figured, how to use Cloud Build and Docker Compose together:

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



## Regional builds

Described in [FR: Select build region](https://issuetracker.google.com/issues/63480105) (Google IssueTracker)

>Regional builds are actually of little value. It's not unreasonable to build everything in `us-central1` though the operation of the results would be elsewhere.
