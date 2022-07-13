# Known Issues


<!-- hidden; hopefully solved? tbd.

## `docker compose run test` gets stuck

This happens on macOS (Docker Desktop 4.0).

In another terminal:

```
$ npm run start
```

```
$ docker compose run test
...
> test:rules:all
> NODE_OPTIONS=--experimental-vm-modules jest --config test-firestore-rules/jest.config.js --verbose --detectOpenHandles --all

(node:100) ExperimentalWarning: VM Modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

If you don't see more output here, it's stuck.

Try Docker > Restart.
-->

<!-- hidden; hopefully solved? tbd.
## `npm test` fails with timeouts (2000 ms) ‼️‼️‼️‼️

This is known to happen on the first run (macOS). The reason is not known, and the author keeps thinking that *any* backend test should be runnable within 2000ms. So, this is essentially a bug.

- [ ] Figure out where the time is wasted. Is it Firebase Emulators; Docker; something else? 
- Can we make (also) first runs happen within 2000ms each?

### Work-around

Run the tests again; they should pass.
-->

## `functions/node_modules/`

This is an empty directory, created by running `npm run start`. It's caused by the way we share the `functions/` folder as writable, but map `functions/node_modules` to a separate folder in `tmp`).

Just ignore it.

You can remove it once the `emul` container is deleted, but it will reoccur.
