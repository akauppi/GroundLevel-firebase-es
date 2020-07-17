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

### Still using Babel

Unlike in the rest of the project, we cannot currently (Jul 2020; Jest 26.1.0) enable native Node.js ES module support. Jest is not up to it, yet, and needs Babel. Once we can, we will abandon Babel here, as well.


## Running tests

We'll be using the Firebase emulator to run the tests against.

There are two ways to run these tests, each with their pros and cons. We'll start with the one where a server is manually started.

### Dev: Start an emulator

When developing security rules, this is the mode to use. We start a Firebase emulator in one terminal, and run the tests in another - or in an IDE.

**Starting the emulator**

```
$ firebase emulators:start --only firestore
```

Once we run tests, the emulator shows warnings of the rules in its terminal output. Glance it, occasionally.

**Running tests**

```
$ npm run test:projects
$ npm run test:symbols
$ npm run test:invites
$ npm run test:all
```

These are prepared for you in `package.json`. When working, it's meaningful to run only one suit, at a time.

The emulator picks up changes to the rules automatically, so you don't need to restart it.


### CI: As a single command

Once tests pass, you'll likely be just running them over and over, e.g. from a CI script.

This command starts the emulator in the background, for the duration of running the tests. It adds ~5..6s to the execution time of the tests.

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


## Deeper dive details 🤿

### Jest introduction

Before digging into the code, it's really worth checking the Introduction chapters of:

- [Jest](https://jestjs.io/docs/en/getting-started)


### WebStorm shared run configurations

If you are using the WebStorm IDE, you should have a shared run configurations (`../.idea/runConfigurations`). This allows you to run the tests from the IDE, and/or debug them.

![](.images/webstorm-run-config.png)

Launch the Firebase emulator on the background, as mentioned earlier.


### WARNING: Use of dates in `data.js`

Firebase Web client can take JavaScript `Date` objects and convert them to its `Timestamp` automatically.

HOWEVER, `Date.now()` and `Date.parse` do <u>not</u> produce Date objects but Unix epoch numbers, so be warned.

||Use|<font color=red>Don't use!</font>|
|---|---|---|
|Current time|`new Date()`|<strike>`Date.now()`</strike>|
|Specific time|`new Date('27 Mar 2020 14:17:00 EET')`|<strike>`Date.parse('27 Mar 2020 14:17:00 EET')`</strike>|

*Note: We could detect these automatically by applying the access rules also to the admin setup. That would catch the discrepancies. Now we don't do it, and we don't test validity of reads, either, so these go through.*


<!-- experimental, disabled...
## Using with Dockerfile

The Dockerfile is there, to allow customer projects to check their rules, without needing to pull our `npm` dependencies.

Build the Docker image:

```
$ docker build .
...
Successfully built ca23750c9cb9
```

Use as: 

```
$ docker run -v $(pwd):/app $(pwd)/dut.rules:/app/dut.rules ca23750c9cb9
...
```

>Note: The `dut.rules` is separately mentioned, since it's a symbolic link in our case.
-->

<!-- disabled, those are not useful (8.6.0)
### Firebase coverage analysis

With the "against-a-standalone-emulator" approach, one can get [coverage reports](https://firebase.google.com/docs/firestore/security/test-rules-emulator#generate_test_reports) on the usage of Security Rules. This sounds great, but the author hasn't really found much use in them (the implementation is messy).
-->

## References

- [Testing Firestore Security Rules With the Emulator](https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/) (article, Oct 2018)
- [Connect your app and start prototyping](https://firebase.google.com/docs/emulator-suite/connect_and_prototype) (Firebase docs)
- [Firebase Security Rules and Tests for Firebase](https://medium.com/flutter-community/firestore-security-rules-and-tests-for-firebase-e195bdbea198) (blog, Feb 2020)

