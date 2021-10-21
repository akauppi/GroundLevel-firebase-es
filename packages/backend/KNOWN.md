# Known Issues


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
> NODE_OPTIONS=--experimental-vm-modules jest --config test-rules/jest.config.js --verbose --detectOpenHandles --all

(node:100) ExperimentalWarning: VM Modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

If you don't see more output here, it's stuck.

Try Docker > Restart.
