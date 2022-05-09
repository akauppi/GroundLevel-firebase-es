# Approach


## Waking up Cloud Functions

The Firebase Emulators (`firebase-tools` 9.16.0) leave Cloud Functions "resting" after launch.

This is tedious, and causes initial tests easily to time out. We've counteracted this with:

- `docker-compose.yml` has a `warm-up` service that exercises Cloud Functions by running some tests, and then opens port 6768 for business
- Actual tests check for the 6768 port, before advancing

>Note: Around `firebase-tools` 10.6.0, the warm-up no longer seems to be sufficient / behave as before. Tests often time out (> 2000 ms), anyhow.


## Use of Docker Compose

We've gone "all in" - happened step by step. Launching the emulators (and doing warm-up) in Docker Compose just *is* simpler than alternative means (handling concurrency with `npm` packages).

Added benefit is unification of the Developer Experience.

**Developer Experience**

We still run tests (Jest) natively, not in DC. This seems like a good balance.

**CI**

In CI, everything is Docker Compose.

**App**

The application sub-package needs backend support that is slightly different than the needs for the backend testing.

This repo provides those:

- `docker-compose.app[.ci].yaml`
- `package.json`: `app:start`

This is a small burden. Since these are backend services, it feels best to declare them here rather than in the `app` folder.


## Installing `functions/` packages

This is now always done within DC, ensuring that we have a specific Node.js version in place. The host Node.js version does not matter - and thus we don't see the Firebase "unsupported version" error:

```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: undefined,
npm WARN EBADENGINE   required: { node: '16' },
npm WARN EBADENGINE   current: { node: 'v18.0.0', npm: '8.6.0' }
npm WARN EBADENGINE }
```

*Above happened before using DC for installing `firebase/node_modules`.*
