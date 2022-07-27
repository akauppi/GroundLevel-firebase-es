# Track

## Caching of Cloud Build build steps

- [Google Cloud Build not caching custom build steps?](https://stackoverflow.com/questions/53420807/google-cloud-build-not-caching-custom-build-steps) (StackOverflow)

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

- [-] [Proposal for a (MUCH) slimmer cypress/included image](https://github.com/cypress-io/cypress-docker-images/pull/476) (PR; Apr 2021)


Cypress used to be HUGE (1.2GB). It's now a mere 922MB (Docker Hub), but there would still be opportunities to bring it lower.

`@OrangeDog` [wrote](https://github.com/cypress-io/cypress-docker-images/pull/476#issuecomment-878303202) (Cypress PR comments) in Jul 2021:

>It's an Electron app, so you get an entire duplicate installation of NodeJS and Chromium.
>
>Possibly some specific headless browser builds could be used, so none of the GUI dependencies are needed.


<img width=700 style="border-radius: 20px" src="https://ichef.bbci.co.uk/news/624/mcs/media/images/74045000/jpg/_74045748_2851796.jpg" /> *<sub>Image source: [BBC](https://ichef.bbci.co.uk/news/976/mcs/media/images/74045000/jpg/_74045748_2851796.jpg)</sub>*

Cypress has a whole [section on CI/CD](https://docs.cypress.io/guides/continuous-integration/introduction) (Cypress docs), but lacks a ready-made Docker image that would only bring Node.js, Cypress, and **one** headless browser.

### Wish to...

- Get a *single image* that is
   - light (~500MB)
   - has a *single headless* browser, or none (but easy instructions to bring one in!)

### Don't need...

- multiple pre-installed browsers
- video recordings 🎥


# Cloud Build `docker` image is HUGE!!!

>I've given up on this (any Cloud Build "official" images). They don't update in time, they lack behind discussions elsewhere (sample case: Google "recommending" use of regular Node.js images like `node:18-alpine` - yet also hosting its own that is stuck in Node.js 14).
>
>Even having this text is so unnecessary. <image width=150 src="https://static.wikia.nocookie.net/disney/images/1/1c/Profile_-_Eeyore.png/revision/latest/scale-to-width-down/1000?cb=20210516060155" />

```
$ docker image list
REPOSITORY                       TAG         IMAGE ID       CREATED        SIZE
gcr.io/cloud-builders/docker     latest      c600d8cb407e   9 hours ago    807MB <---
docker/compose                   latest      c3e188a6b38f   2 years ago    80.9MB
```

- [Cloud builders](https://cloud.google.com/build/docs/cloud-builders) (Cloud Build docs)
- [GitHub repo](https://github.com/GoogleCloudPlatform/cloud-builders)

There are *supposed* to be the fastest way to bring tools to Cloud Build, but at 807MB (!!), it's not!

>Note: Docker has something called docker-on-docker. Since Cloud Build *already* is a Docker environment (right?) the Docker image for it should build on this platform. The author has the feeling the 800+ MB image doesn't - but lacks knowledge to make things better. That's why he uses GCP - so that *they* take care that things are efficient and done "right".


## Availability of builders in Artifact Registry

- [ ] [[FR] Make builders available via Artifact Registry](https://github.com/GoogleCloudPlatform/cloud-builders/issues/844)

Once / if they become, we could use them. No special big benefit, though.

<!--
>⛔️ Google doesn't give much focus to the builders. For one, the Docker image is huge (see above). For `npm`, they discuss of recommending (practically: they do) the stock images, but this is not clearly mentioned in documentation. Nor is their ancient (Node.js 14) `npm` builder marked as deprecated.
>
>These are all signs to "keep out" (not of Cloud Build, but of Cloud Build builders).
>
>Not publishing the builders in Artifact Registry is just one sign of the same neglect.
-->

What Google could do (instead) is:

- forget about official images
- cache any images a certain user is using/has used (over, say, 24h)


## Emulators may fail with 0 RC

- [ ] [When emulators don't launch the return code should always be non-zero](https://github.com/firebase/firebase-tools/issues/4754) (GitHub; Jul 2022)

We live with it. Check anyways, at times..


## "Unhandled error cleaning up build images."

- [ ] ["Unhandled error cleaning up build images."](https://github.com/firebase/firebase-tools/issues/4757) (GitHub; Jul 2022)

   Likely something that's caused by the move to Artifact Registry.

  
**Work-around:**

Add the `Service Account User` role, or deploy manually from the user account (not Cloud Build service account).
