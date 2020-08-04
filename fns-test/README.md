# Functions test

Test Cloud Functions for the application.

We test against a locally running emulator, using normal JavaScript Firebase client. This differs from the Firebase suggested model of [unit testing](https://firebase.google.com/docs/functions/unit-testing).

Benefits:

- less things to learn: same APIs we use elsewhere

**Approach**

The emulated Firestore database is primed at server start (not as part of the tests). Tests run using normal Firebase clients.

We do **not** use Security Rules. All access is available, during the tests. This applies "separation of concerns" to testing and helps keep the tests simple.


## Requirements

>We aim to eventually use Docker for this part, so multiple levels of Node installations are not needed.

```
$ npm install
```
 
Set up the Firebase project:

```
firebase use --add
```

>It shouldn't matter which project you choose. It's a bit weird that Firebase insists on this step (see `DEVS/Wishes for Firebase.md`) in the main project.

 
Set up the Firestore emulator:

```
$ firebase setup:emulators:firestore
```

>Note: Rerun the setup above if you have upgraded `firebase-tools`.


## Running tests

There are two ways to run these tests, each with their pros and cons. We'll start with the one where a server is manually started.

### Dev: Start an emulator

When developing security rules, this is the mode to use. We start a Firebase emulator in one terminal, and run the tests in another - or in an IDE.

**Starting the emulator**

```
$ npm run start
```

Once we run tests, the emulator shows warnings of the rules in its terminal output. Glance it, occasionally.

**Running tests**

```
$ npm run test:monitoring
$ npm run test:userInfo
...
$ npm run test:all
```

These are prepared for you in `package.json`. When working, it's meaningful to run only one suit, at a time.

The emulator picks up changes to the rules automatically, so you don't need to restart it.


### CI: As a single command

Once tests pass, you'll likely be just running them over and over, e.g. from a CI script.

This command starts the emulator in the background, for the duration of running the tests. It adds ~5..6s to the execution time of the tests.

```
$ npm test
...
```

<!-- tbd. output above -->


<!-- disabled
## References

- Cloud Functions   v-- we DO NOT use this
  - [Unit Testing of Cloud Functions](https://firebase.google.com/docs/functions/unit-testing) (Firebase docs)
-->


## Developer notes

### Changes to `functions/index.js` are not watched

Firebase emulator (`firebase-tools` 8.6.0) does not seem to pick up changes to the functions sources. You must restart the emulator.


## References

- Cloud Functions > [Get Started](https://firebase.google.com/docs/functions/get-started) (Firebase docs)

