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


## Installing `functions/` packages

This is now done only within DC; there is no `functions/node_modules` on the host filesystem, at all.

>In practise, it's kept at `tmp/functions-node_modules`, to carry it across DC steps.

The intention is to avoid confusion because `functions/node_modules` can be seen as a Cloud Functions implementation detail.

<!-- hint
If you need the files in the host, you can: `cd functions; NO_GUARD=1 npm install`
-->
