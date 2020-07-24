/*
* fns-test/temp.test.js
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { __ } from '../.__.js'; const { projectId } = __;

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

const fns = firebase.app().functions(/*"europe-west3"*/);

describe ('addMessage()', () => {
  test ('returns Message with text: Howdy added.', done => {
    const req = {query: {text: 'Howdy'} };

    const x = await fns.httpsCallable()

    const res = {
      send: body => {
        expect (body).toBe (`Message with text: Howdy added.`);
        done();
      }
    };
    testFunctions.addMessage (req, res);


  });
});
