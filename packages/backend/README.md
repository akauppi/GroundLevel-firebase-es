# Back-end

Back-end features for GroundLevel sample application.

Responsible for:

- implementation and documentation of the back-end
   - data structures
   - access rights
   - database back-end processes 
   - proxying to Cloud Logging (ops)
- testing the back-end


## Requirements

- Node 14 or 16
- `npm` >= 7.7.0

   >`npm` 7 is needed for the way we refer between subpackages (`file://`). For Node 14, please update to `npm` 7.

- Docker Desktop

<!-- 
developed with:
- macOS 11.4
- node 16.5
- npm 7.19

- Docker Desktop 3.5.2 with: 1 CPU core, 1.5 GB RAM
-->

## Getting started

```
$ npm install
```

<!-- Editor's note
Ideally, we just instruct people to `npm test` and it automatically launches Firebase Emulators (and shuts them down.

It used to be like this. However, timeouts and Docker jams caused to (hopefully, temporarily) go to this "keep emulators running all the time" approach.
-->

For the time you are working with `backup`, start Firebase Emulators in another terminal and keep them running:

```
$ npm run start
...
```

In the first terminal:

```
$ npm test
```

The tests should pass, or be skipped.

>If you have timeout problems, just run `npm test` again. We have problems with Firebase Emulators taking awefully long to launch Cloud Functions, under Docker. See `APPROACH.md`.

## Development workflow

<!-- was
```
$ npm start
```

This launches the Firebase emulator in one terminal, and automatically picks up changes to the sources.

You can then run individual tests against it (see `package.json` for the precise name of commands).
-->

In addition to running all the tests at once, you can run individual tests like this:

```
$ npm run test:fns:userInfo
```

This is useful when working on a certain test. Look in `package.json` for all such commands.

## Deploying

Actual deploying is expected to be done via Continuous Integration. See `ci` at the repo root.

However, to get a staging instance up and running for the benefit of the front end sub-packages (they need it), follow the instructions in the root `README`: [Deployment to staging](../../README.md#deployment-to-staging)

