# Rules-test

This folder contains the pieces necessary to test Firestore Security Rules. 

**The folder is optional and self-sufficient.** You can remove it if you don't see value in it. However, the ability to test your rules while you are refining them is awesome.

For all of the commands in this document, you are expected to be in the folder:

```
$ cd rules-test
```

## Requirements

The setup uses [Jest](https://jestjs.io) as the testing engine and needs some npm dependencies to be installed.

```
$ npm install
```
 
Set up the Firestore emulator:

```
$ firebase setup:emulators:firestore
```

>Note: Rerun the setup above if you have upgraded `firebase-tools`.


<!-- disabled
## Internals

The rules being tested are symbolic-linked to the main project's `firestore.rule` file (git supports symbolic links). This means if you edit either of the rules, they are both changed.

In your git it looks like the root rules changed, when you edit either.
-->


## Running tests

We'll be using the Firebase emulator to run the tests against.

There are two ways to run these tests, each with their pros and cons. We'll brief you here on the commands so that you can choose what best suits your needs, and maybe edit the `package.json`, accordingly. ☺️


### CI: As a single command (good for getting started and CI)

With this variant, you run a single command. It starts the emulator in the background, executes the tests, and cleans up the emulator.

```
$ npm test

> rules-test@0.0.0 test /.../GroundLevel-firebase-web/rules-test
> firebase emulators:exec --only firestore 'npx jest'

i  emulators: Starting emulators: firestore
✔  hub: emulator hub started at http://localhost:4400
i  firestore: Serving ALL traffic (including WebChannel) on http://localhost:6767
⚠  firestore: Support for WebChannel on a separate port (6768) is DEPRECATED and will go away soon. Please use port above instead.
i  firestore: firestore emulator logging to firestore-debug.log
✔  firestore: firestore emulator started at http://localhost:6767
i  firestore: For testing set FIRESTORE_EMULATOR_HOST=localhost:6767
i  Running script: npx jest
...
```

This variant takes slightly longer (~6 sec) but is simple. It's best suited for CI work where the tests need to be run only once (thus it's the default `test` target).


### DEV: Against the emulator running in the background (good for dev)

Here, you keep the emulator running in a separate terminal. This cuts the time the test framework is set up by ~4 sec for each run, so it's good for test-and-change work.

In a separate terminal:

```
$ firebase emulators:start --only firestore
...
✔  emulators: All emulators started, it is now safe to connect.
...
```

Then, run test with:

```
$ npm run test-dev
```

This is the approach you should use in development. Also, this approach you to get [coverage reports](https://firebase.google.com/docs/firestore/security/test-rules-emulator#generate_test_reports) on the usage of Security Rules.


## Reading for developers

Before contributing to the project, please familiarise yourself with:

- [Jest](https://jestjs.io/docs/en/getting-started) Introduction chapters 

### WebStorm shared run configurations

If you are using the WebStorm IDE, you should have a shared Run Configuration in the `/.idea/runConfigurations` folder. This allows you to run the rules tests from the IDE, and/or debug them.

![](.images/webstorm-run-config.png)


### WARNING: Use of dates in `data.js`

Firebase Web client can take JavaScript `Date` objects and convert them to its `Timestamp` automatically. 

HOWEVER, the frequent `Date.now()` and `Date.parse` do <u>not</u> produce Date objects but Unix epoch numbers, instead.

||USE|Don't use!|
|---|---|---|
|Current time|`new Date()`|<strike>`Date.now()`</strike>|
|Specific time|`new Date('27 Mar 2020 14:17:00 EET')`|<strike>`Date.parse('27 Mar 2020 14:17:00 EET')`</strike>|

*Note: We could detect these automatically by applying the access rules also to the admin setup that's currently done. That would catch the discrepancies. Now we don't do it, and we don't test validity of reads, just writes, so these got through.*



## References

- [Testing Firestore Security Rules With the Emulator](https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/) (article, Oct 2018)
- [Connect your app and start prototyping](https://firebase.google.com/docs/emulator-suite/connect_and_prototype) (Firebase docs)
- [Firebase Security Rules and Tests for Firebase](https://medium.com/flutter-community/firestore-security-rules-and-tests-for-firebase-e195bdbea198) (blog, Feb 2020)

