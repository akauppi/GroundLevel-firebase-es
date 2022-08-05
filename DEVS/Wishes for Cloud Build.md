# Wishes for Cloud Build


## Caching Docker Compose builds 🔥🔥🔥

Cloud Build's approach of having each step a Docker image is brilliant.

It's also fast, when the "official" images are used.

However, one cannot do much real work with the official images alone. And this leads to the *same* images being pulled over and over. They are pulled only once *per CI script execution* but if one tweaks the script, retriggers the build, again most of the 2..5 minutes goes to pulling images.

This could be cached.

But it's actually multiple slightly different problems together, so let's take them one by one. Also, I will comment why the use of a "Kaniko" builder is not applicable for this, as it now is.

This *feels* like an abandoned yard of Google Cloud Platform. Someone should clean it up.

### This repo's use of Docker images for Cloud Build steps

|image|category|
|---|---|
|`gcr.io/cloud-builders/git`|official|
|`gcr.io/cloud-builders/gsutil`|official|
|`node:{16|18}-alpine`|Docker Hub|
|`us-central1-docker.pkg.dev/ci-builder/builders/firebase-emulators:11.3.0`|Prebuilt custom|
|`docker/compose:1.29.2`|Docker Hub|
|`cypress/included:10.3.0`|Docker Hub|
|`./packages/app/tools/prime.dc/Dockerfile`|custom, inside the repo|
|`./packages/app/tools/vite.dc/Dockerfile`|custom, inside the repo|

Official images don't pose a problem. They show the target for the rest of the steps...

### Node.js image

Taking this separately, since it's special.

In [one place](...) Cloud Build recommends using the "latest Node.js image". However, in [another place](...) it recommends an official Node.js image that is stuck in Node 14.

The documentation is not consistent.

The approach on recommending the official Node.js image feels like the right one, only doing so should be brought to the same no-pulling performance level as the official images are.

It this optimization is done by *automatically caching* recently used images (meaning `node:{16|18}-alpine` would never be pulled, when this user's CI scripts need it), there is no longer a need for a layer between "official" and Docker Hub images. (Currently, such a layer is called ["Community-contributed images"](https://cloud.google.com/build/docs/configuring-builds/use-community-and-custom-builders#using_community-contributed_builders) (Cloud Build docs).


### Docker (Compose) image

The list of ["Supported builder images provided by Cloud Build"](https://cloud.google.com/build/docs/cloud-builders#supported_builder_images_provided_by) (Cloud Build docs) contains an image for `docker`.

In May 2022, the `docker compose` (v2) command [was added to the official image](https://github.com/GoogleCloudPlatform/cloud-builders/issues/835).

However, there **must** be something wrong here.

- The official image is based on Ubuntu 20.04, and weighs > 800MB
- The Docker Hub `docker/compose:1.29.2` is **10 x smaller**

Isn't there a thing called Docker-on-docker. And Cloud Build is running Docker underneath? Could that be used in the official image, instead of shipping a whole OS?

>I may be wrong.
>
>All I know is that the *recommended* way (for running `docker compose`) turned out slower **also in practise** than using the (less recommended) `docker/compose:1.29.2`.
>
>Someone at Google who knows about these things could have a look. 🙏

### Docker Hub images

If the caching suggestion for Docker Hub images (see `Node.js image`, above) were implemented, it would speed up use of any Docker Hub images.

This would shave off maybe 40-50% (tbd. measure) of the front-end tests we perform. It would be sweet!!!

### Caching build results

This is a bit extreme example.

Docker Compose allows images to be built on-demand. Like this:

```
services:
  vite-base:   # used for 'npm run dev:local', 'npm run dev:online', 'npm test'
    build:
      context: tools/vite.dc
      target: vite_plain
```

The Vite image is built, ad hoc, whenever needed.

If Google were to cache the Docker Hub images - and maybe any pulled images - perhaps it can tap onto such ad hoc builds as well.

Using such ad-hoc images within a repo is surprisingly powerful.


### Prebuilt custom image

There's one more step that we use:

```
us-central1-docker.pkg.dev/ci-builder/builders/firebase-emulators:11.3.0
```

If "ad hoc" images were cached, we would deal with the `firebase-emulators` in that way. For now, the developer pre-builds and pushes it to an Artifact Registry.

This is an optimization that trades manual labor for slightly faster CI jobs.


### Kaniko caching is not a solution

Cloud Build documentation mentions Kaniko caching, e.g. in [Using Kaniko cache](https://cloud.google.com/build/docs/optimize-builds/kaniko-cache):

>Kaniko cache is a Cloud Build feature that caches container build artifacts by storing and indexing intermediate layers within a container image registry, such as Google's own Container Registry, where it is available for use Kaniko.

Note:

- It talks only about `Container Registry`, not the more recent `Artifact Registry`

- The typo / badly ending sentence *", where it is available for use Kaniko"???*

Nevertheless, it *seems* to the author that Kaniko is intended for **building Docker images** to be stored in Container Registry. Note that that is nowhere clearly defined by Cloud Platform. They write about it as if it were a generic caching system, but the author thinks it's not.

- How would I use a Kaniko image, as a Cloud Build step?

It looks like a dead end, and one not applicable to Cloud Build builder images.


### Business incentives 👺

One could argue that Cloud Build has no incentive to make builds faster.

Builds are charged by CPU seconds.


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

This is possible, and *highly* useful, but not clearly documented. It was by persistence and luck that the author finally got it to work.

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

As described in [FR: Select build region](https://issuetracker.google.com/issues/63480105) (Google IssueTracker)
