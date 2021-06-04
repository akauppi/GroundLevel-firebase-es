# Wishes for Firebase CLI

This file contains wishes regarding the `firebase-tools` (Firebase CLI), including emulator when command line is concerned.

Library/runtime wishes are in [Wishes for Firebase](./Wishes for Firebase.md).


## Would like to control, whether Firebase hosting emulation changes the port if taken, or fails

Using port 3000 for `dev` (online) and 3001 for `dev:local` gets blurred, if a `npm run dev` is launched twice. Firebase emulator automatically looks for the next available port, and we just see the warning:

```
Port 3000 is in use, trying another one...
```

It would be nice to have a flag/config setting to disallow changing ports. It can even be the port entry itself, with "!3000" meaning we mean business - don't allow any other than 3000, ok?!

**Work-around:**

We now have a special script to check the availability of the wanted port. Works, but adds complexity.


## Firebase emulator configuration from a `.js` file

It is nowadays customary (babel etc.) that configuration can be provided in a `.json`, or a `.js` file. Using `.js` files allows one to have comments in there.

Firebase CLI (9.5.0) seems to be fixed on `firebase.json` and providing a `firebase.js` is ignored.


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


## Firestore emulator: ability to load rules from multiple files 🌺🌸🌺

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

*What is the use case of leaking to the cloud?*

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



<!-- (moved from general "Wishes for Firebase"; are these already covered?

## Firestore emulator: evaluate the rules at launch (and complain!)

The Firestore emulator has just a single file of Security Rules. It could evaluate (compile) it at launch, fail if there are problems and show warnings if there are any.

It does not currently (8.6.0) do so. This is a launch with a syntax error in the rules file:

```
$ firebase emulators:start --only firestore
i  emulators: Starting emulators: firestore
✔  hub: emulator hub started at http://localhost:4400
i  firestore: firestore emulator logging to firestore-debug.log
✔  firestore: firestore emulator started at http://localhost:6767
i  firestore: For testing set FIRESTORE_EMULATOR_HOST=localhost:6767
✔  emulators: All emulators started, it is now safe to connect.
...
```

Now the error happens at runtime and may even get lost somewhere in test code (if it's ignored exceptions).

![](.images/bad-rules.png)

Warnings are shown only if the file is edited:

```
i  firestore: Change detected, updating rules...
⚠  ../firestore.rules:98:16 - WARNING Unused function: validProject2.
⚠  ../firestore.rules:110:35 - WARNING Invalid variable name: request.
✔  firestore: Rules updated.
```

It would be useful and fair to show these already at the launch.


## Firebase emulator: check for 'package.json' at launch!

```
$ npm run start
...
[emul] ┌───────────┬────────────────┬─────────────────────────────────┐
[emul] │ Emulator  │ Host:Port      │ View in Emulator UI             │
[emul] ├───────────┼────────────────┼─────────────────────────────────┤
[emul] │ Functions │ localhost:5002 │ http://localhost:4000/functions │
[emul] ├───────────┼────────────────┼─────────────────────────────────┤
[emul] │ Firestore │ localhost:6767 │ http://localhost:4000/firestore │
[emul] └───────────┴────────────────┴─────────────────────────────────┘
[emul]   Emulator Hub running at localhost:4400
[emul]   Other reserved ports: 4500
[emul] 
[emul] Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
[emul]  
[init] Primed :)
[init] GCLOUD_PROJECT=bunny npm run _start_2 exited with code 0


[emul] ⚠  The Cloud Functions directory you specified does not have a "package.json" file, so we can't load it.
[emul] ⚠  functions: Could not find package.json
```

That error is logged only *once running tests*. The Functions emulator could just as well check that it's environment looks cosy, at launch. 

Similar to the "check rules early" mentioned above.

-->

## Local emulator UI

..could hide the UI modules that aren't active. 

E.g. if we start with `--only functions,firestore`, only those boxes need to be visible in the UI.


## Way to suppress the "Received SIGTERM 2 times" warning

Running under Docker, this isn't relevant to our users:

```
[emul] ⚠  emulators: Received SIGTERM 2 times. You have forced the Emulator Suite to exit without waiting for 1 subprocess to finish. These processes may still be running on your machine: 
[emul] 
[emul] ┌────────────────────┬──────────────┬─────┐
[emul] │ Emulator           │ Host:Port    │ PID │
[emul] ├────────────────────┼──────────────┼─────┤
[emul] │ Firestore Emulator │ 0.0.0.0:6767 │ 30  │
[emul] └────────────────────┴──────────────┴─────┘
[emul] 
[emul] To force them to exit run:
[emul] 
[emul] kill 30
```

Would like to have a parameter (or `firebase.json` configuration) that allows this to be suppressed. Since we run under Docker, no unterminated processes will remain.


## `firebase emulators:start` behaves different from `emulators:exec`

<!-- Note: This is no longer an issue for this project - we don't use `emulators:exec` at all. -->

This is a surprise for developers.

e.g. the `debug()` feature of Security Rules (undocumented) places the notes in `stdout` with `emulators:exec` but into `firestore-debug.log` if run via `emulators:start`.

The two commands look similar, and there's no cue to make us think they would work differently. 

Suggestion:

Bring the `:exec` and `:start` commands closer. Either merge them, or hide the internal implementation aspects (`start` is said to be a "wrapper") from the developers.


## Firebase hosting emulator: show 404's as errors

Currently shown as info (same as any lines):

```
i  hosting: 127.0.0.1 - - [15/Mar/2021:00:36:30 +0000] "GET /app.css HTTP/1.1" 404 146 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
```

Wouldn't it at least be good to show them as warnings? This would help spot places, where the front end is trying to reach a non-existing file.

I'd personally expect the lines as errors, but it's not really an error of the server... Your choice, but I think `info` is unhelpful.


## Faster launch

```
$ time firebase use
Active Project: prod-zurich (groundlevel-160221)
...
real	0m2.338s
user	0m1.291s
sys	0m0.396s
```

That 2.4 seconds means I might not want to keep a project check in the `package.json`, for each serve.

Not sure where it spends the time.

>This has been reported, and Firebase are looking into it (`gcloud --version` is 2x faster than `firebase --version`). 

>*Less of interest since we don't deal with an active Firebase project, any more (though CI runs will benefit).*


<!-- Irrelevant, when going the Docker (no activation) way.
## Using `firebase use` in a monorepo

Currently (`firebase` CLI 9.8.0), the activation of a project is per directory.

How could we make it so that the folders `packages/*` each can use the same project, without the person needing to `firebase use --add` three times?
-->

## Firebase Hosting Emulator: does it support `HEAD`?

Doesn't seem to:

```
$ curl --head -v http://localhost:3000
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3000 (#0)
> HEAD / HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.64.1
> Accept: */*
> 
< HTTP/1.1 404 Not Found
HTTP/1.1 404 Not Found
< Access-Control-Allow-Origin: *
Access-Control-Allow-Origin: *
< Date: Thu, 22 Apr 2021 23:17:02 GMT
Date: Thu, 22 Apr 2021 23:17:02 GMT
< Connection: keep-alive
Connection: keep-alive
< Keep-Alive: timeout=5
Keep-Alive: timeout=5
< Content-Length: 0
Content-Length: 0

< 
* Connection #0 to host localhost left intact
* Closing connection 0
```

This is when the same `http://localhost:3000` returns 200 for `GET`.


## Cloud Functions (or Firestore) emulator: doesn't warm up at launch

**Expected**

Just launching emulators would provide consistent performance, as if the functions are warmed up.

**Actual**

In running the backend tests, tests dealing with Cloud Functions take considerably longer on the first run (run under Docker):

```
[test-fns]   userInfo shadowing
[test-fns]     ✓ Central user information is distributed to a project where the user is a member (6395 ms)
...
[test-fns]   Can proxy application logs
[test-fns]     ✓ good log entries (3040 ms)
```

vs. subsequent runs:

```
[test-fns]   userInfo shadowing
[test-fns]     ✓ Central user information is distributed to a project where the user is a member (313 ms)
...
[test-fns]   Can proxy application logs
[test-fns]     ✓ good log entries (112 ms)
```

- 20 and 27 times more

**Why this matters**

If the user is instructed to launch a backend server in a separate window, it would be reasonable to presume full and consistent behaviour from such launch onwards.

This is not the case.

While it makes sense in the cloud that Cloud Functions need to be warmed up, there is no benefit from this under emulation. The request is that the emulators be changed so that the "subsequent" (lesser) timings start instantly (or, at the least, some 5..10 seconds after) the server has started.

---

- [ ] Report to Firebase `#contribute`

