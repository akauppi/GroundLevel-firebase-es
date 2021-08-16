# Back-end

Back-end features for GroundLevel sample application.

Responsible for:

- implementation and documentation of the back-end
   - data structures
   - access rights
   - database back-end processes 
   - proxying to Cloud Logging (ops)
- testing the back-end

**Folder structure**

```
├── functions             # Cloud Functions definitions
├── functions-warm-up     # code that makes sure Cloud Functions are awake
├── sh                    # build tools
├── test-fns              # tests for Cloud Functions
└── test-rules            # tests for Firestore Security Rules
```

The root has various configuration files.

## Requirements

- Node 14 or 16
- `npm` >= 7.7.0

   >`npm` 7 is needed for the way we refer between subpackages (`file://`). For Node 14, please update to `npm` 7.

- Docker Desktop

<!-- 
developed with:
- macOS 11.5
- node 16.6
- npm 7.20

- Docker Desktop 3.6.0 with: 1 CPU core, 1.5 GB RAM
-->

## Getting started

```
$ npm install
```

Make sure Docker is running and:

```
$ npm test
```

The tests should pass, or be skipped.

><details><summary>Note to Windows users:</summary>
>
>![](.images/defender-docker.png)
>   
>If you get this warning about Docker Desktop, at least
>   
>- **uncheck the "public networks" checkbox**. It's not needed.
>   
>It seems weird to the author that Windows would default to opening up things like that. Anyways, things continue to proceed in the background, regardless of what you select, but at least **do not press OK** without removing that one checkbox.
></details>

## Development workflow

```
$ npm start
```

This launches the Firebase emulators in one terminal, and automatically picks up changes to the sources.

You can then run individual tests against it:

```
$ npm run test:fns:userInfo
```

This is useful when working on a certain test. Look in `package.json` for all such commands.

>Note: If you now run `npm test`, it will use the existing emulators instead of launching a new set.


## Deploying

Deploying is done via Continuous Integration. See `ci` at the repo root.

