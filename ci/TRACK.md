# Track

## Caching of Cloud Build build steps

- [Google Cloud Build not caching custom build steps?](https://stackoverflow.com/questions/53420807/google-cloud-build-not-caching-custom-build-steps) (SO)

This would **REALLY** be welcome!!!

Should cover:

- any images the project has used within a caching period
- any `build:` images, built via Docker Compose

*If you have knowledge that GCP is considering this, or a link to share to a ticket that can be tracked, that'd be SPLENDID!*


## Alpine-based (= slim) Cypress base image, with no browser

- [ ] [Create a cypress/alpine minimal image](https://github.com/cypress-io/cypress-docker-images/issues/110) (Issue; May 2019)

- [ ] [Proposal for a (MUCH) slimmer cypress/included image](https://github.com/cypress-io/cypress-docker-images/pull/476) (PR; Apr 2021)

Cypress is a bit of a pain, when it comes to CI/CD.

![](https://ichef.bbci.co.uk/news/624/mcs/media/images/74045000/jpg/_74045748_2851796.jpg) 
*<p align=right><sub>Image source: [BBC](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bbc.com%2Fnews%2Fblogs-magazine-monitor-26893638&psig=AOvVaw2qbN-giI51CuTpqhvgG53D&ust=1653322785342000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMjc_77B8_cCFQAAAAAdAAAAABAD)</sub></p>*

It has a whole [section on CI/CD](https://docs.cypress.io/guides/continuous-integration/introduction) (Cypress docs), yet it doesn't provide a lean-and-mean, headless only image.

### Current state

[`cypress/included`](https://hub.docker.com/r/cypress/included) weighs 1.17 GB (9.6.0)

>Docker images with all operating system dependencies, Cypress, and some pre-installed browsers.

I don't need "some" pre-installed browsers. One would be enough.

### Wish to...

- Get a *single image* that is
   - light
   - has a *single* browser, or none (but easy instructions to bring one in!)

### Don't need...

- Video recordings

Being Alpine-based would help slim down the overall size.


## GCP: built-in image with `docker compose`

- [ ] [[FR] Add `docker compose` to the official `gcr.io/cloud-builders/docker` image](https://github.com/GoogleCloudPlatform/cloud-builders/issues/835)

The Cloud Build [pre-built images](https://github.com/GoogleCloudPlatform/cloud-builders/tree/master/docker) could add `apt-get install docker-compose-plugin` in their recipe.

This would:

- allow using `docker compose` in Cloud Build scripts
- ..without needing to pull in external images.
- keep the `docker compose` implementation up-to-date

Docker Compose allows certain things (setting up a service running in the background of Cloud Build) easier than doing the same with mere `docker` CLI.

Currently (May 2022), the `docker/compose` [external image](https://hub.docker.com/r/docker/compose) is stuck at 1.29.2.
