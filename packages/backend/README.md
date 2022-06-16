# Back-end

Back-end features for GroundLevel sample application.

Responsible for:

- implementation and documentation of the back-end
   - data structures
   - access rights
   - database back-end processes 
- testing the back-end

**Folder structure**

```
├── functions             # Cloud Functions definitions
├── test-fns              # tests for Cloud Functions
└── test-firestore-rules  # tests for Firestore Security Rules
```

These are the main folders. There are also:

```
├── logs     # Logs from Firebase Emulator runs. Useful for debugging.
└── tmp      # Temporary files; used in interfacing with DC
```

>Note: The approach taken in this repo differs from "normal" Firebase Emulator use. We use Docker Compose and never need the emulators to be installed on the development machine. See [`APPROACH.md`](APPROACH.md).

The root has various configuration files.

## Requirements

- Node 16+
- `npm` 8
- Docker Compose 2.0

	<details><summary>Installation on Linux</summary>
	If you use a command line version of Docker, follow these instructions to have DC 2.0:
   
   - [Install on Linux](https://docs.docker.com/compose/install/#install-compose-on-linux-systems)

	Alternatively, you can use [Docker Desktop on Linux](https://docs.docker.com/desktop/linux/install/).
	</details>
	
<!-- 
developed with:
- macOS 12.4
- node 18.3
- npm 8.11

- Docker Desktop 4.9.0 with: 3 CPU cores, 2 GB RAM, 512 MB swap
   - experimental > Enable VirtioFS
-->


## Getting started

Make sure Docker is running (we use it already in the installing phase).

```
$ npm install
```

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

## Deploying

Deploying is done via Continuous Integration. See `ci` at the repo root.
