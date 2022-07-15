# Track

## Caching of Cloud Build build steps

- [Google Cloud Build not caching custom build steps?](https://stackoverflow.com/questions/53420807/google-cloud-build-not-caching-custom-build-steps) (SO)

This would **REALLY** be welcome!!!

Should cover:

- any images the project has used within a caching period
- any `build:` images, built via Docker Compose

*If you have knowledge that GCP is considering this, or a link to share to a ticket that can be tracked, that'd be SPLENDID!*


## Slim Cypress base image, without Electron

- [ ] [Create a cypress/alpine minimal image](https://github.com/cypress-io/cypress-docker-images/issues/110) (Issue; May 2019)

   `admah` commented in Jun 2022:
   
   >\#597 introduced `bullseye-slim` as the current base image for all Cypress images. There is no plan currently by the Cypress team to create an `alpine`-based image.

   That seems to be the end of it (though the issue remains open).

- [ ] [Proposal for a (MUCH) slimmer cypress/included image](https://github.com/cypress-io/cypress-docker-images/pull/476) (PR; Apr 2021)

   Likely now superceded by the official work (still open, though).

---

Cypress used to be HUGE (1.2GB). It's now a mere 922MB (Docker Hub), but there would still be space (pun) to bring it lower.

`@OrangeDog` [wrote](https://github.com/cypress-io/cypress-docker-images/pull/476#issuecomment-878303202) (Cypress PR comments) in Jul 2021:

>It's an Electron app, so you get an entire duplicate installation of NodeJS and Chromium.
>
>Possibly some specific headless browser builds could be used, so none of the GUI dependencies are needed.


<img width=600 src="https://ichef.bbci.co.uk/news/624/mcs/media/images/74045000/jpg/_74045748_2851796.jpg" /> *<sub>Image source: [BBC](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bbc.com%2Fnews%2Fblogs-magazine-monitor-26893638&psig=AOvVaw2qbN-giI51CuTpqhvgG53D&ust=1653322785342000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMjc_77B8_cCFQAAAAAdAAAAABAD)</sub>*

Cypress has a whole [section on CI/CD](https://docs.cypress.io/guides/continuous-integration/introduction) (Cypress docs), but lacks a ready-made Docker image that would only bring Node.js, Cypress, and **one** headless browser.

### Current state

[`cypress/included`](https://hub.docker.com/r/cypress/included) weighs 922MB (10.3.0) <!-- was: 1.17 GB (9.6.0) -->

>Docker images with all operating system dependencies, Cypress, and some pre-installed browsers.

### Wish to...

- Get a *single image* that is
   - light
   - has a *single* browser, or none (but easy instructions to bring one in!)

### Don't need...

- multiple pre-installed browsers. One would be enough.
- Video recordings


<!-- REMOVE: they fixed it. Use 'gcr.io/cloud-builders/docker'

## GCP: built-in image with `docker compose`

- [ ] [[FR] Add `docker compose` to the official `gcr.io/cloud-builders/docker` image](https://github.com/GoogleCloudPlatform/cloud-builders/issues/835)

   The Issue was closed, without comments. 😥

The Cloud Build [pre-built images](https://github.com/GoogleCloudPlatform/cloud-builders/tree/master/docker) could add `apt-get install docker-compose-plugin` in their recipe.

This would:

- allow using `docker compose` in Cloud Build scripts
- ..without needing to pull in external images.
- keep the `docker compose` implementation up-to-date

Docker Compose allows certain things (setting up a service running in the background of Cloud Build) easier than doing the same with mere `docker` CLI.

Currently (May 2022), the `docker/compose` [external image](https://hub.docker.com/r/docker/compose) is stuck at 1.29.2.

-->


## Cloud Build `docker` image is HUGE!!!

```
$ docker image list
REPOSITORY                             TAG         IMAGE ID       CREATED        SIZE
gcr.io/cloud-builders/docker           latest      c600d8cb407e   9 hours ago    807MB
...
docker/compose                         latest      c3e188a6b38f   2 years ago    80.9MB
```

Cloud Build provides ready-made "builder" images:

- [Cloud builders](https://cloud.google.com/build/docs/cloud-builders) (Cloud Build docs)
- [GitHub repo](https://github.com/GoogleCloudPlatform/cloud-builders)

There are *supposed* to be the fastest way to bring tools to Cloud Build, but at 800MB (!!), it's not!

What is going on here?

- [ ] Is anyone else concerned???

   Left some note in a related issue. Don't really care. Check at some point, whether it's still that big (by `docker pull`).


## Availability of builders in Artifact Registry

- [ ] [[FR] Make builders available via Artifact Registry](https://github.com/GoogleCloudPlatform/cloud-builders/issues/844)

Once / if they become, we could use them. No special big benefit, though.