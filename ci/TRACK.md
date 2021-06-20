# Track

## Cypress ❤️ Alpine

- [Create a cypress/alpine minimal image](https://github.com/cypress-io/cypress-docker-images/issues/110)

If we can have Electron run on Alpine, a Cypress CI image could be built on top of `firebase-ci-builder`.

Otherwise, we need two different kinds of images (Debian for Cypress).

- [Alpine Linux support](https://github.com/cypress-io/cypress/issues/419) (Cypress issues)

This would be the REAL THING!!

- 💥💥 [Run Cypress Headless Without Binary](https://github.com/cypress-io/cypress/issues/1232) 💥💥

>...if we supported Chrome headless (which we will)

- [Separate Electron, Cypress app code, and ffmpeg into individual downloads](https://github.com/cypress-io/cypress/issues/3899)
- [Running cypress in headless mode should not use xvfb](https://github.com/cypress-io/cypress/issues/16505)

*Sum-up: Forget about Alpine - too hard. Focus on tracking where work on headless-friendliness goes. Then .. at some point (2022/23?) introduce a Docker image for the UI side testing. 👏👏*
