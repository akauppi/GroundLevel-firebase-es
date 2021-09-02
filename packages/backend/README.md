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

**Important files**

```
docker-compose.yml    # Launching the emulators  
firebase.json         # Port definitions for the emulators
```

The root has various configuration files.

## Requirements

- Node 14 or 16
- `npm` >= 7.7.0

   >`npm` 7 is needed for the way we refer between subpackages (`file://`). For Node 14, please update to `npm` 7.

- Docker Compose 2.0

	<details><summary>Installation on Linux</summary>
   DC 2.0 comes with Docker Desktop for Windows and Mac. The Linux version
   needs to be separately installed, for now.
   
   - [Compose v2 Release Candidate](https://docs.docker.com/compose/cli-command/) (Docker docs)
   - [Install on Linux](https://docs.docker.com/compose/cli-command/#install-on-linux)
	</details>
	
<!-- 
developed with:
- macOS 11.5
- node 16.8
- npm 7.21

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

>Note: There's a lot of noise in the above step, because of starting and closing down the emulators. You can avoid this by launching emulators in another terminal, as described below.


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

