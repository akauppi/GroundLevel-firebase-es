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
├── test-fns              # tests for Cloud Functions
└── test-rules            # tests for Firestore Security Rules
```

The root has various configuration files.

## Requirements

- Node 16
- `npm` >= 7.7.0

   >`npm` 7 is needed for the way we refer between subpackages (`file://`).

- Docker Compose 2.0

	<details><summary>Installation on Linux</summary>
   DC 2.0 comes with Docker Desktop for Windows and Mac. The Linux version
   needs to be separately installed, for now.
   
   - [Compose v2 Release Candidate](https://docs.docker.com/compose/cli-command/) (Docker docs)
   - [Install on Linux](https://docs.docker.com/compose/cli-command/#install-on-linux)
	</details>
	
<!-- 
developed with:
- macOS 12.3
- node 17.7
- npm 8.5

- Docker Desktop 4.6 with: 2 CPU cores, 2 GB RAM, 512 MB swap
   - experimental > Enable VirtioFS
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

>Note: The above command uses Docker Compose to launch, and warm up, Firebase Emulators. They remain running until you run `docker compose down` in this directory.


## Development workflow

```
$ npm start
...
Firebase Emulators are running. Use 'docker compose down' to run them down.

```

This launches the Firebase emulators, and automatically picks up changes to the sources.

You can then run individual tests against it:

```
$ npm run test:fns:userInfo
```

This is useful when working on a certain test. Look in `package.json` for all such commands.

>Note: If you now run `npm test`, it will use the existing emulators instead of launching a new set.


## Leaving the scene

```
$ docker compose down
```

Closes the Firebase Emulators, releasing the ports they needed.

Do this eg. when switching between backend and front-end work. Also `../app` uses Docker Compose and some of the ports overlap.


## Deploying

Deploying is done via Continuous Integration. See `ci` at the repo root.
