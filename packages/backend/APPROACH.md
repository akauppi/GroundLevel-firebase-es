# Approach


## Warming up Firebase Emulators

The Firebase Emulators (`firebase-tools` 9.16.0) leave Cloud Functions "resting" after launch.

This is tedious, and causes initial tests easily to time out. We've counteracted this with:

- `docker-compose.yml` has a `warm-up` service that exercises Cloud Functions by running some tests

>Note: Around `firebase-tools` 10.6.0, the warm-up no longer seems to be sufficient / behave as before. Tests often time out (> 2000 ms), anyhow.


## Catering for app development

The application sub-package needs backend support that is slightly different than the needs for the backend testing.

This repo provides those:

- `docker-compose.app[.ci].yaml`
- `package.json`: `app:start`

This is a small burden. Since these are backend services, it feels best to declare them here rather than in the `app` folder.
