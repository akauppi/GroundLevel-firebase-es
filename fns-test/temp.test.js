/*
* fns-test/temp.test.js
*
* EXPERIMENTAL test. Can be removed when things work. :)
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

/*** REMOVE
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

const fns = firebase.app().functions(/_*"europe-west3"*_/);
***/

import firebase from 'firebase/app/dist/index.cjs.js'
import "firebase/functions/dist/index.cjs.js"

const projectId = "vue-rollup-example"

firebase.initializeApp({
  projectId    // must match what you have in '.firebaserc'
});

const FUNCTIONS_URL = "http://localhost:5001";
firebase.functions().useFunctionsEmulator(FUNCTIONS_URL);   // must be *after* '.initializeApp'

const fns = firebase.app().functions(/_*"europe-west3"*_/);

describe ('addMessage()', () => {
  test ('returns a greeting', async () => {
    const msg = 'Howdy';

    const fnAddMessage = fns.httpsCallable("addMessage");

    const data = (await fnAddMessage(msg)).data;

    debugger;

    expect(data).toBe("xxx");
  });
});
