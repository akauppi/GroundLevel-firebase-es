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

   `npm` 7 is needed for the way we refer between subpackages (`file://`). For Node 14, please update to `npm` 7.

- Docker Desktop

<!-- 
developed with:
- macOS 11.4
- node 16.2
- npm 7.19

- Docker Desktop 3.3.4 with: 1 CPU core, 1.5 GB RAM
-->

### Docker settings

Using Docker makes launching Firebase Emulators a little bit (5..7 s) slower than if they were run natively. However, you don't need to restart the emulators that often, so this is deemed as tolerable.

<!-- 13..16 vs. 8..9 s (on macOS) 
-->

>If you experience time-outs with the tests, see [DEVS/Docker Performance.md](../../DEVS/Docker%20Performance.md).


## Getting started

```
$ npm install
```

```
$ npm test
```

The tests should pass, or be skipped.

## Development workflow

```
$ npm start
```

This launches the Firebase emulator in one terminal, and automatically picks up changes to the sources.

You can then run individual tests against it (see `package.json` for the precise name of commands).

e.g. 

```
$ npm run test:fns:userInfo
```

## Alternative: use native `firebase-tools`

The above instructions require you to have Docker running.

If you rather develop with Firebase CLI (globally installed), use these commands:

```
$ npm run ci:test   # instead of 'npm test'
$ npm run ci:start  # instead of 'npm start'
```

## Deploying

Actual deploying is expected to be done via Continuous Integration. See `ci` at the repo root.


## Role of `npm run start`

If you leave the `npm run start` running, it will be picked up by front-end development and testing (`packages/app`), as well.

If you don't, those tests will automatically restart the emulators.

It is up to you, which way of working you prefer, but now you know that the same instance is usable for both backend and front-end development.
