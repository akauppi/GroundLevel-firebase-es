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

- `npm`
- Docker, or `firebase-tools` globally installed

   >Note: We recommend `npm` 7.7.0+ due to some inconsistencies found with `npm` 6.

<!-- 
developed with:
- macOS 11.4
- node 16.2
- npm 7.13
-->

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
$ npm run ci        # instead of 'npm test'
$ npm run ci:start  # instead of 'npm start'
```

## Deploying

Actual deploying is expected to be done via Continuous Integration. See `ci` at the repo root.


## Role of `npm run start`

If you leave the `npm run start` running, it will be picked up by front-end development and testing (`packages/app`), as well.

If you don't, those tests will automatically restart the emulators.

It is up to you, which way of working you prefer, but now you know that the same instance is usable for both backend and front-end development.
