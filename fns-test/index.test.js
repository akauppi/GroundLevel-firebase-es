/*
* fns-test/index.test.js
*
* Get started with Cloud Functions tests.
*/
//import './tools/jest-matchers';

import { sessionProm } from './tools/guarded-session';

import { strict as assert } from 'assert';

import * as firebase from '@firebase/testing';

const FieldValue = firebase.firestore.FieldValue;

const anyDate = new Date();   // a non-server date

import { test, expect, describe, beforeAll } from '@jest/globals'

/*
* Run provided tests either after each other, or in parallel. Here to see whether this matters, at all.
*
* Results:
*   - 'Promise.all' (parallel) is slightly (-10%) faster than sequential. We should keep using that, since conceptually
*     the test steps are always unrelated (since we don't intend to modify the database).
*
* Note:
*   - replace by 'Promise.all' once we know the results
*/
const SEQ = false;

describe("'/invites' rules", () => {
  let unauth_invitesC, auth_invitesC, abc_invitesC, def_invitesC;

  beforeAll(async () => {
    const session = await sessionProm();
    try {
      const coll = session.collection('invites');   // root collection

      unauth_invitesC = coll.as(null);
      auth_invitesC = coll.as({uid: '_'});
      abc_invitesC = coll.as({uid: 'abc'});
      def_invitesC = coll.as({uid: 'def'});

      assert(unauth_invitesC && auth_invitesC && abc_invitesC && def_invitesC);
    } catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error("Failed to initialize the Firebase database: ", err);
      throw err;
    }
  });

  //--- InvitesC read rules ---

  test('no-one should be able to read', async () => {

    if (SEQ) {
      await expect(unauth_invitesC.get()).toDeny()   // unauthenticated
      await expect(auth_invitesC.get()).toDeny()     // valid user (trying to list the invites)

      await expect(abc_invitesC.get("a@b.com:1")).toDeny()   // the one who's created an invite

    } else {
      await Promise.all([
        expect(unauth_invitesC.get()).toDeny(),   // unauthenticated
        expect(auth_invitesC.get()).toDeny(),     // valid user (trying to list the invites)

        expect(abc_invitesC.get("a@b.com:1")).toDeny()   // the one who's created an invite
      ]);
    }
  });
}
