/*
* fns-test/userInfo.test.js
*
* Test that '/projectsC/.../userInfoC' gets updated, by cloud functions, when the global '/userInfoC' changes (if
* users are in the project).
*/
import { strict as assert } from 'assert'

import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

// tbd. We can use various session IDs if we just keep them consistent within a run (or... does Functions require the
//    real one be used?)
//
import { __ } from '../.__.js'; const { projectId } = __;

import * as firebase from 'firebase/app'   // according to npm firebase instructions
//import 'firebase/functions'

/*** not needed???
const [FUNCTIONS_URL, FIRESTORE_HOST] = ["http://localhost:5001", "localhost:8080"];

firebase.functions().useFunctionsEmulator(FUNCTIONS_URL);   // must be *after* '.initializeApp'

firebase.firestore().settings({   // affects all subsequent use (and can be done only once)
  host: FIRESTORE_HOST,
  ssl: false
});
***/

// Access to Firebase. Note: no security rules are applied - those are tested separately.
//
import { db } from './tools/session.js'

describe("userInfo shadowing", () => {

  // Note: We don't declare 'async done => ...' for Jest. That is an oxymoron: only either 'done' or the end of an
  //    async/await body would resolve a test but not both.
  //
  test('Central user information is distributed to those projects where the user is a member', done => {
    const william = {
      name: "William D.",
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
    }

    (async () => {
      // Check that 'abc' currently doesn't have user information
      const projectUserInfo_qss = await db.collection("projects/1/userInfo").get();

      assert( projectUserInfo_qss.size == 0, "Project 1 userInfo already has contents" );

      // Prepare a watch
      //
      const unsub = db.collection("projects/1/userInfo").doc("abc")
        .onSnapshot( ss => {
          console.debug("Noticed: ", ss);   // DEBUG

          expect( ss.exists );
          assert( ss.size == 1 );
          const o = ss.data();
          expect( Object.keys(o) == ["name", "photoURL"] );
          expect( o.name == william.name );
          expect( o.photoURL == william.photoURL );

          unsub();
          done();
        });

      // Write in central
      await db.collection("userInfo").doc("abc").set(william);
    })();

    // keep rolling.. (Jest waits for the 'done')
  });
});
