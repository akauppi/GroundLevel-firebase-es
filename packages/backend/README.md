# Back-end

Back-end features for GroundLevel sample application.

Responsible for:

- implementation and documentation of the back-end
   - data structures
   - access rights
   - database back-end processes 
- testing the back-end
- monitoring proxy to Grafana Cloud

**Folder structure**

```
├── functions             # Cloud Functions definitions
├── test-firestore-rules  # tests for Firestore Security Rules
└── test-fns              # tests for Cloud Functions
```

These are the main folders. There are also:

```
├── logs[.app]  # Logs from Firebase Emulator runs. Useful for debugging.
└── tmp         # Temporary files; used in interfacing with DC
```

>Note: The approach taken in this repo differs from "normal" Firebase Emulator use. We use Docker Compose and never need the emulators to be installed on the development machine. See [`APPROACH.md`](APPROACH.md).

The root has various configuration files.

## Requirements

- Node 16+
- `npm` 8
- GNU `make`
- Docker Compose 2.0 (as per `docker compose version`)

<!-- 
developed with:
- macOS 12.6
- node 18.11
- npm 8.19

- Docker Desktop 4.13.0 with: 3 CPU cores, 2 GB RAM
   - experimental > Enable VirtioFS
-->


## Getting started

```
$ make install
```

```
$ make test
```

The tests should pass, or be skipped.

>Note: The above command uses Docker Compose to launch the Firebase Emulators. They remain running until you run `make down-all` in this directory.


## Development workflow

```
$ make start
...
Firebase Emulators are running. Use 'docker compose down' to run them down.

```

This launches the Firebase emulators, and automatically picks up changes to the sources.

You can then run individual tests against it:

```
$ make test:fns:userInfo
```

This is useful when working on a certain test. Look in `Makefile` for all such commands.


## Leaving the scene

```
$ make down-all
```

Closes the Firebase Emulators, releasing the ports they needed.


## Deploying

Deploying is done via Continuous Integration. See `ci` at the repo root.
