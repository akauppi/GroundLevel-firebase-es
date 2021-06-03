# Back-end

Back-end features for GroundLevel sample application.

Responsible for:

- implementation and documentation of the back-end
   - data structures
   - access rights
- testing the back-end


## Requirements

- `npm`
- Java Runtime Engine (JRE) "version 1.8 or later"

   >Note: We recommend `npm` 7.7.0+ due to some inconsistencies found with `npm` 6. If you need to use `npm` 6, run `npm run prepare` manually.

<!-- 
developed with:
- macOS 11.4
- node 16.x
- npm 7.x
-->

## Getting started

```
$ npm install
```

>Note: There is a separate `functions/node_modules` for the emulated Cloud Functions. Its packages will be installed/updated automatically, with this command.

```
$ npm run ci
```

The tests should pass, or be skipped.

## Development workflow

```
$ npm run start
```

This launches the Firebase emulator in one console, and automatically picks up changes to the sources.

You can then run individual tests against it (see `package.json` for the precise name of commands).

e.g. 

```
$ npm run test:fns:userInfo
```

## Deploying

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

It seems the functions are not able to know this from Firebase itself; we need to set it to a config that the functions run with. This is a one time thing.

```
$ npx firebase-tools functions:config:set regions.0="europe-west6"   # use the 'locationId' from above
```

This setting is a one-time errand unless you change regions. You can now forget about it.


### Actual deployment

```
$ npm run deploy
...

=== Deploying to 'groundlevel-160221'...

i  deploying firestore, functions
i  firestore: reading indexes from ./firestore.indexes.json...
i  cloud.firestore: checking ./firestore.rules for compilation errors...
✔  cloud.firestore: rules file ./firestore.rules compiled successfully
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
✔  functions: required API cloudbuild.googleapis.com is enabled
✔  functions: required API cloudfunctions.googleapis.com is enabled
i  functions: preparing ./functions directory for uploading...
i  functions: packaged ./functions (38.53 KB) for uploading
✔  firestore: deployed indexes in ./firestore.indexes.json successfully
i  firestore: latest version of ./firestore.rules already up to date, skipping upload...
✔  functions: ./functions folder uploaded successfully
✔  firestore: released rules ./firestore.rules to cloud.firestore
...
i  functions: creating Node.js 14 (Beta) function logs_v1(europe-west6)...
✔  functions[logs_1(europe-west6)]: Successful delete operation. 
i  functions: updating Node.js 14 (Beta) function userInfoShadow_2(europe-west6)...
✔  functions[logs_v1(europe-west6)]: Successful create operation. 
✔  functions[userInfoShadow_2(europe-west6)]: Successful update operation. 

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/groundlevel-160221/overview
```

