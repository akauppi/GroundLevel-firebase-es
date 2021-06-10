# Docker vs. native `firebase-tools`

The repo defaults to the idea that a developer would use Docker to run the Firebase emulators. 

However, you might not want to use Docker (let's say you have a more restricted computer and working with Docker is slow). In this case, you can utilize the CI commands. Here are the details.

## Conventions

This applies to both `packages/backend` and `packages/app`.

- `make test` is for humans
- `make run start|dev` are for humans
- `make run ci` is for CI (no Docker involved) 
- `make run ci:start|dev` is for CI (no Docker involved)

Use `npm run ci:start` instead of `npm start`, and so forth.

You will obviously need `firebase-tools` installed either at the repo root, or globally, as well as a JRE (Java Runtime Engine) that the emulators expect.

