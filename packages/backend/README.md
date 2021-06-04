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

## Before deploying

Actual deploying is expected to be done via Continuous Integration (see `ci` at the repo root). 

If you deploy to a region other than Firebase default (`us-central1`), follow these one-time rules (or edit the functions sources so that the regions are fixed):


### Let functions know their region

Check your project's location either in [Firebase Console](https://console.firebase.google.com) > Project > App > ⚙️ > `Default GCP resource location`

..or by:

```
$ npx firebase-tools apps:sdkconfig
...
firebase.initializeApp({
  "projectId": "groundlevel-160221",
    ...
  "locationId": "europe-west6",
    ...
});
```

It seems the functions are not able to know this from Firebase itself; we need to set it to a config that the functions run with (or write within the function sources).

```
$ npx firebase-tools functions:config:set regions.0="europe-west6"   
  # use the 'locationId' from above
```

This setting is a one-time errand unless you change regions.

