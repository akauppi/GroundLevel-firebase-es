# Wishes for Firebase CLI

This file contains wishes regarding the `firebase-tools` (Firebase CLI), including emulator when command line is concerned.

Library/runtime wishes are in [Wishes for Firebase](./Wishes for Firebase.md).


## Would like to control, whether Firebase hosting emulation changes the port if taken, or fails

Using port 3000 for `dev` (online) and 3001 for `dev:local` gets blurred, if a `npm run dev` is launched twice. Firebase emulator automatically looks for the next available port, and we just see the warning:

```
Port 3000 is in use, trying another one...
```

It would be nice to have a flag/config setting to disallow changing ports. It can even be the port entry itself, with "!3000" meaning we mean business - don't allow any other than 3000, ok?!


## Firebase emulator configuration from a `.js` file

It is nowadays customary (babel etc.) that configuration can be provided in a `.json`, or a `.js` file. Using `.js` files allows one to have comments in there.

Firebase (8.6.0) seems to be fixed on `firebase.json` and providing a `firebase.js` (or `firebase.cjs`) is ignored.


## Firebase emulators should fail fast ‼️

The emulator should fail to start if there is no configuration available. Currently, it proceeds and gives a runtime error when one tries to use it.

```
$ firebase emulators:start --project=bunny --only functions,firestore
i  emulators: Starting emulators: functions, firestore
⚠  functions: The following emulators are not running, calls to these services from the Functions emulator will affect production: auth, database, hosting, pubsub
⚠  Your requested "node" version "14" doesn't match your global version "15"
⚠  functions: Unable to fetch project Admin SDK configuration, Admin SDK behavior in Cloud Functions emulator may be incorrect.
i  firestore: Firestore Emulator logging to firestore-debug.log
i  ui: Emulator UI logging to ui-debug.log
i  functions: Watching "/Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions" for Cloud Functions...
⚠  The Cloud Functions emulator requires the module "firebase-functions" to be installed. This package is in your package.json, but it's not available. You probably need to run "npm install" in your functions directory.
i  functions: Your functions could not be parsed due to an issue with your node_modules (see above)
```

..but the emulator keeps running. **THIS IS NOT ACCEPTABLE!** We developers lose time, because one needs to really scan the logs to find out the functions aren't really up. You are not being resilient here - you are simply pretending like things are okay when they aren't. Exit!!! (with non-zero) 👺


## Firestore emulator: ability to load rules from multiple files

Currently (8.6.0), all rules must be in a single file, defined in `firebase.json`:

```
"rules": "../firestore.rules",
```

I would prefer a freedom to place separate collections' rules in separate files. This makes the source code more managable, as you can imagine (my project is small, yet has separate "projects", "symbols" and "invites" collections).

Implementation could allow an array in addition to the current string entry:

```
"rules": ["../firestore.rules", ...]
```

## Firebase emulator: ability to check in tests whether Security Rules are healthy

When editing security rules, I normally have the IDE and the test output visible - not the terminal running the Firebase emulator.

If security rules are broken, the test output is garbage:

```
  ● '/projects' rules › user needs to be an author, to read a 'removed' project

    expect.assertions(2)

    Expected two assertions to be called but received one assertion call.

      67 | 
      68 |   test('user needs to be an author, to read a \'removed\' project', () => {
    > 69 |     expect.assertions(2);
         |            ^
      70 |     return Promise.all([
      71 |       expect( abc_projectsC.doc("2-removed").get() ).toAllow(),
      72 |       expect( def_projectsC.doc("2-removed").get() ).toDeny()

      at Object.<anonymous> (projectsC.test.js:69:12)
```

The Firebase testing library could provide a function to check the validity of the current Security Rules, from the emulator. I can then use this in a "before all" hook, and not run the tests if they are not going to work.


## Emulator: if you cannot deliver, please fail!

```
$ npm run start:rest

...
> concurrently -n emul,init "firebase emulators:start --config firebase.norules.json --only functions,firestore" "npm run _start_rest_2"

[init] 
[init] > firebase-jest-testing@0.0.1-alpha.2 _start_rest_2 /Users/asko/Git/firebase-jest-testing
[init] > wait-on http://localhost:4000 && FIREBASE_JSON=firebase.norules.json node --harmony-top-level-await sample/prime-docs.js
[init] 
[emul] i  emulators: Starting emulators: firestore
[emul] ⚠  functions: Not starting the functions emulator, make sure you have run firebase init.
[emul] ⚠  firestore: Did not find a Cloud Firestore rules file specified in a firebase.json config file.
[emul] ⚠  firestore: The emulator will default to allowing all reads and writes. Learn more about this option: https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration.
[emul] i  firestore: Firestore Emulator logging to firestore-debug.log
[emul] i  ui: Emulator UI logging to ui-debug.log
[emul] 
...
```

Above, the emulators are clearly started with `--only functions,firestore` parameter.

The log output states (as a warning):

>[emul] ⚠  functions: Not starting the functions emulator, make sure you have run firebase init.

It's like. I know you want Cloud Functions, but I don't know how to. But I'll keep on going anyhow. (maybe you won't notice)

PLEASE NO‼️‼️

It drains developers' time that something *seems* to launch, but doesn't do its job. The only meaningful way out when required features are explicitly requested is **to fail with a non-zero return code**. This would make the developer instantly understand something went wrong.

`firebase` 8.7.0

### Similar

```
> firebase emulators:start --config firebase.json --only firestore

⚠  Could not find config (firebase.json) so using defaults.
i  emulators: Starting emulators: firestore
⚠  firestore: Did not find a Cloud Firestore rules file specified in a firebase.json config file.
⚠  firestore: The emulator will default to allowing all reads and writes. Learn more about this option: https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration.
i  firestore: Firestore Emulator logging to firestore-debug.log
i  ui: Emulator UI logging to ui-debug.log

┌───────────────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! View status and logs at http://localhost:4000 │
└───────────────────────────────────────────────────────────────────────┘

┌───────────┬────────────────┬─────────────────────────────────┐
│ Emulator  │ Host:Port      │ View in Emulator UI             │
├───────────┼────────────────┼─────────────────────────────────┤
│ Firestore │ localhost:8080 │ http://localhost:4000/firestore │
└───────────┴────────────────┴─────────────────────────────────┘
  Other reserved ports: 4400, 4500

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
```

>⚠  Could not find config (firebase.json) so using defaults.

I'd prefer a failed launch, when the config file is explicitly stated: `--config firebase.json` and not found.

In this case, the file *was there* but it wasn't valid JSON. Please strive to make the error messages precise. The file **was found** but its contents were not valid. I don't want line-wise error message, just "not valid JSON" is enough to get one fast on the right bug. 🏹🐞


## Emulators: don't leak to the cloud

The `firebase emulators:exec` and `emulators:start` `--only` flag works like this:

- named services are emulated
- for other services, the cloud instances are used

What is the use case of such leaking to the cloud?

As a developer, I would prefer to keep emulation and cloud project completely separate. At the least, there should be (a `--only-only`?? :) ) flag, to state I just want emulated services.

Output from current `npm run dev` launch:

```
...
[emul] ⚠  functions: The following emulators are not running, calls to these services from the Functions emulator will affect production: database, hosting, pubsub
...
```

This is mostly just to "feel safe", I guess.


## `firebase use` to detect whether there's an active project

Current situation (`firebase-tools` 8.11.1):

```
$ firebase use | more

ESC[1mESC[31mError:ESC[39mESC[22m No active project
```

`firebase use` works differently, based on whether it's part of a pipe (above) or run interactively. This is not the problem.

When run as pipe, it shouldn't do the ANSI graphics (above). This is not the problem, either.

Return code is 0, even when there's no active project. This is the problem and causes one to parse the output, in order to know (in a script) whether there's an active project.

**Suggestion:**

`firebase use` could return with a non-zero exit code, if there is no current project.

This is a breaking change.

