# Rules-test

This folder contains the pieces necessary to test Firestore Security Rules. 

The folder is optional and self-sufficient. You can remove it if you don't see value in it. However, the ability to test your rules while you are refining them is awesome.



## Requirements

The setup uses [Jest](https://jestjs.io) as the testing engine and needs some npm dependencies to be installed.

```
$ npm install
```
 
You also need the Firestore emulator:

```
$ firebase setup:emulators:firestore
```

Tie your local folder to a Firebase project (creates `.firebaserc`):

```
$ firebase use --add
...
```


## Internals

The rules being tested are symbolic-linked to the main project's `firestore.rule` file (git supports symbolic links). This means if you edit either of the rules, they are both changed.


## Running tests

We'll be using the Firebase emulator to run the tests against.

There are two ways to run these tests, each with their pros and cons. We'll brief you here on the commands so that you can choose what best suits your needs, and maybe edit the `package.json`, accordingly. ☺️

### A: `firebase emulators:exec`

This variant uses Firebase's command to run the tests, while an emulator is running.

The port of the emulator is decided in `firebase.json`. We never see it.

```
$ firebase emulators:exec --only firestore 'npm test'
```

This variant is good for CI-like tests, for its simplicity.


### B: `firebase emulators:start`

Separates starting the emulator and running the tests. The port we have in `firebase.json` needs to be replicated in the commands.

Start the service in its own terminal:

```
$ firebase emulators:start --only firestore
...
```

Then run tests:

```
$ FIRESTORE_EMULATOR_HOST=localhost:6767 \
  npm test
```

This is useful if you wish to have the emulator running all the time in the background (speeds up edit-test loop), or if you want [coverage reports]() on the usage of Security Rules.

><font color=red>🐞 BUG: While the 'B' commands work separately, running them from `package.json` with the `start-server-and-test` doesn't. That process doesn't seem to detect when the emulator port is up. Though it should. 
>
>This is no big thing since alternative 'A' works.</font>

---

Choose either one. 


## References

- [Testing Firestore Security Rules With the Emulator](https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/) (article, Oct 2018)
- [Connect your app and start prototyping](https://firebase.google.com/docs/emulator-suite/connect_and_prototype) (Firebase docs)