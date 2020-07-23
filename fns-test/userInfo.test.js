/*
* fns-test/userInfo.test.js
*
* Test that 'userInfoC' gets updated, by cloud functions, and that there is a "callable" API to read it.
*/
import { strict as assert } from 'assert'

import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { __ } from '../.__.js'; const { projectId } = __;

// ONLY for Firestore
//import * as firebaseTesting from '@firebase/testing'

import * as firebase from 'firebase/app'   // according to npm firebase instructions

import 'firebase/functions'
import 'firebase/firestore'

firebase.initializeApp({
  projectId    // must match what you have in '.firebaserc'
});

const [FUNCTIONS_URL, FIRESTORE_HOST] = ["http://localhost:5001", "localhost:8080"];

firebase.functions().useFunctionsEmulator(FUNCTIONS_URL);   // must be *after* '.initializeApp'

firebase.firestore().settings({   // affects all subsequent use (and can be done only once)
  host: FIRESTORE_HOST,
  ssl: false
});

/*
* Initialize Firebase
*_
beforeAll( () => {

  fns = firebase.app().functions(/*"europe-west3"*_/);
  assert(fns);
});
***/

/*** not needed???
 afterAll( () => {
  firebase.app().delete();
})
 ***/

describe("temporary test", () => {

  test('Cloud Function should act on our writes', async () => {

    // Write initial value

    firebase.firestore().document("temp").set{ a: 1 }
  });

  // ...tbd. real UserInfo tests

});
