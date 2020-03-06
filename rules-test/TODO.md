# TODO

## Launch the emulator from `npm`

We could use `start-server-and-test` to launch the emulator in the background, for each test.

This didn't initially work (Asko) and it'll slow down the cycle a bit anyhow, so... maybe worth a study, later.

- [ ] Was unable to set the `--port` for the Firestore emulator.   Client would respect `FIRESTORE_EMULATOR_HOST=localhost:8089` though.
- [ ] `start-server-and-test` did not proceed to running the tests, even when the service is up

`#help`

