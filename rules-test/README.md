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

## Internals

The rules being tested are symbolic-linked to the main project's `firestore.rule` file (git supports symbolic links). This means if you edit either of the rules, they are both changed.


## Running tests

><font color=red>tbd. Here setting up the Firebase project may be necessary. `firebase add`?</font>


First, open a terminal and launch Firebase emulator in it:

```
$ firebase serve --only firestore
...
i  firestore: Serving ALL traffic (including WebChannel) on http://localhost:8080
i  firestore: Emulator logging to firestore-debug.log
✔  firestore: Emulator started at http://localhost:8080
```

Then, in another terminal, run the tests:

```
$ npx jest
```


## References

- [Testing Firestore Security Rules With the Emulator](https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/) (article, Oct 2018)
