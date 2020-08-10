# Functions test

This folder tests the Cloud Functions.

You run the tests at the project root directory.

**Approach**

The emulated Firestore database is primed at server start (not as part of the tests).

We do **not** use Security Rules. All access is allowed, during the tests. Access rights are tested separately.


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
