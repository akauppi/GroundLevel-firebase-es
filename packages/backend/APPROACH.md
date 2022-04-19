# Approach


## Waking up Cloud Functions

The Firebase Emulators (`firebase-tools` 9.16.0) leave Cloud Functions "resting" after launch.

This is tedious, and causes initial tests easily to time out. We've counteracted this with:

- `docker-compose.yml` has a `warm-up` service that exercises Cloud Functions by running some tests, and then opens port 6768 for business
- Actual tests check for the 6768 port, before advancing



## Use of DC

**Developer Experience**

We use Docker Compose for starting the Emulators, and warming them up, but *not* for running the tests.

- Running tests under DC is way slower, for some reason (at least on Docker Desktop for Mac, 4.0)
- There is no benefit from encapsulation

**CI**

In CI, tests are run via Docker Compose. Here, we have more control over the execution environment (Cloud Build) and probably problems don't affect fellow developers, just the project maintainers.

>Alternatives:
>
>The project earlier used the Emulator image (`firebase-ci-builder`) to also run the tests - since it has Node and `npm`. This works, but tightly couples the emulator container to the test execution environment (them being the same). DC provides more freedom.


**App**

The application sub-package needs backend support that is slightly different than the needs for the backend testing.

Also, it should be a separate instance since we want to keep these two separate. `docker-compose.app.yml` and the `app:start` `npm` target do this: they provide the `app` package a stable backend instance while keeping backend and app concerns separated.
