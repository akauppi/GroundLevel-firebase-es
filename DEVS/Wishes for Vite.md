# Wishes for Vite

## A way to signal from `package.json` to the browser

We're having two developer setups:

- against Firebase cloud
- against local Firebase emulator suite

It would be nice to have e.g. `--global EMUL=true` option for Vite, to pass the information. 

The browser needs to do certain script things, if it is running against the emulator.

We currently use the port for this (3000 for normal; 3001 for emulator).

Could use `--base` - maybe?

Could create an ad-hoc src module, but this means one cannot run both simultaneously, and if the run gets interrupted (ctrl-c) such file may remain.

