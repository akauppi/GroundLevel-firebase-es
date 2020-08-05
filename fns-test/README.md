# Functions test

Test Cloud Functions for the application.

**Approach**

The emulated Firestore database is primed at server start (not as part of the tests).

Tests run using normal Firebase clients.

We do **not** use Security Rules. All access is allowed, during the tests.

Benefits:

- We can use the normal APIs - no need for separate test-only library.
- Separation of concerns to testing security vs. functionality. Helps keep both sides simple.

>Note: This approach differs from the [one suggested](https://firebase.google.com/docs/functions/unit-testing) in Firebase documentation, which focuses on unit testing Cloud Functions. We test them at the integration level.


## Requirements

As `rules-test`, also this is arranged as a self-sufficient sub-folder, having its own dependencies.

```
$ npm install
```
 
Set up the Firebase project:

```
firebase use --add
```

>Note: It shouldn't matter which project you choose, since we are running against an emulator and there is no authentication. It's a bit weird that Firebase insists on this step (see `../DEVS/Wishes for Firebase.md`).

 
Set up the Firestore emulator:

```
$ firebase setup:emulators:firestore
```

>Note: Rerun the setup above if you have upgraded `firebase-tools`.


## Running tests

There are two ways to run these tests, each with their own pros and cons. We'll start with the one where a server is manually started.

### Dev: Start an emulator

We start a Firebase emulator in one terminal, and run the tests in another - or in an IDE.

**Starting the emulator**

```
$ npm run start
```

Once we run tests, it's worth checking the emulator output, occasionally.

**Running tests**

In another terminal:

```
$ npm run test:monitoring
$ npm run test:userInfo
...
$ npm run test:all
```

These are prepared for you in `package.json`. When developing functions, it's meaningful to run only one suit, at a time.

You can easily set the tests to be run from an IDE, see `../rules-test/DEBUGGING.md`.

>NOTE: Unlike Security Rules, where changes are picked up automatically, the emulator **needs to be restarted** if you change the function source code. This is a bit weird.


### CI: As a single command

Once tests pass, you'll likely be just running them over and over, e.g. from a CI script.

This command starts the emulator in the background, for the duration of running the tests. Launching adds ~5..6s to the execution time.

```
$ npm test
...
```

<!-- tbd. output above -->


## References

- Cloud Functions > [Get Started](https://firebase.google.com/docs/functions/get-started) (Firebase docs)