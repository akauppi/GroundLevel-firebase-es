/*
* rules-test/visitedC.test.js
*/
import './tools/jest-matchers';

import { sessionProm } from './tools/guarded-session';

const assert = require('assert').strict;

const firebase = require('@firebase/testing');

const FieldValue = firebase.firestore.FieldValue;

const anyDate = new Date();   // a non-server date

describe("'/visited' rules", () => {
  let unauth_visitedC, auth_visitedC, abc_visitedC, def_visitedC;

  beforeAll( async () => {         // note: applies only to tests in this describe block
    const session = await sessionProm();
    try {
      const coll = session.collection('projects/1/visited');

      unauth_visitedC = coll.as(null);
      auth_visitedC = coll.as({uid:'_'});
      abc_visitedC = coll.as({uid:'abc'});
      def_visitedC = coll.as({uid:'def'});
    }
    catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error( "Failed to initialize the Firebase database: ", err );
      throw err;
    }
  });

  //--- VisitedC read rules ---

  test('unauthenticated access should fail', async () => {
    await expect( unauth_visitedC.get() ).toDeny();
  });

  test('user who is not part of the project shouldn\'t be able to read', async () => {
    await expect( auth_visitedC.get() ).toDeny();
  });

  test('project members may read each other\'s visited status', async () => {
    await expect( abc_visitedC.doc("abc").get() ).toAllow();
    await expect( def_visitedC.doc("abc").get() ).toAllow();   // collaborator

    await expect( abc_visitedC.doc("def").get() ).toAllow();
    await expect( def_visitedC.doc("def").get() ).toAllow();   // collaborator
  });

  //--- VisitedC write rules ---

  test('only the user themselves can set their value (to server timestamp)', async () => {
    const d_serverTime = { at: FieldValue.serverTimestamp() };
    const d_otherTime = { at: anyDate };

    await expect( abc_visitedC.doc("abc").set( d_serverTime )).toAllow();
    await expect( def_visitedC.doc("abc").set( d_serverTime )).toDeny();   // other user

    await expect( abc_visitedC.doc("abc").set( d_otherTime )).toDeny();
    await expect( def_visitedC.doc("abc").set( d_otherTime )).toDeny();   // other user

    // Also 'update' should work but actual code is expected to use 'set'
    await expect( abc_visitedC.doc("abc").update( d_serverTime )).toAllow();
    await expect( def_visitedC.doc("abc").update( d_serverTime )).toDeny();   // other user
  });

  //--- VisitedC delete rules ---
  //
  // In practise, write rules inhibit deletion, but this is not absolutely required (so we don't test).

});
