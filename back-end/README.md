# Back-end

This folder contains the back-end features, and tests for them.

## Testing Cloud Functions

**Approach**

We prime the database with a scenario that the functions then work on. 

Changes are left in the database (you can study them using the Emulator UI).

When tests are re-run, they try to clean away possible trash left by the earlier tests. If you wish to be dead sure, just restart the server at times. 

We test Cloud Functions with full access to all database contents (no security rules). This rises from the philosophy of orthogonal testing. One suite should test one thing. Others can then consider that done. The aim is more simplicity. 

### Running tests in development

When you develop the Cloud Functions, you should start a Firebase emulator in one terminal, and run the tests in another - or in an IDE.

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

When developing functions, it's meaningful to run only one suit, at a time.

You can easily set the tests to be run from an IDE, see `DEBUGGING.md`. <!-- tbd. bring it here, from 'rules-test/DEBUGGING.md -->

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
