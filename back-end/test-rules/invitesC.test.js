/*
* back-end/test-rules/invitesC.test.js
*/
import { strict as assert } from 'assert'

import { test, expect, describe, beforeAll } from '@jest/globals'

import { dbAuth, FieldValue } from 'firebase-jest-testing/firestoreReadOnly'

const anyDate = new Date();   // a non-server date

describe("'/invites' rules", () => {
  let unauth_invitesC, auth_invitesC, abc_invitesC, def_invitesC;

  beforeAll( async () => {
    try {
      const coll = dbAuth.collection('invites');   // root collection

      unauth_invitesC = coll.as(null);
      auth_invitesC = coll.as({uid:'_'});
      abc_invitesC = coll.as({uid:'abc'});
      def_invitesC = coll.as({uid:'def'});

      assert(unauth_invitesC && auth_invitesC && abc_invitesC && def_invitesC);
    }
    catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error( "Failed to initialize the Firebase database: ", err );
      throw err;
    }
  });

  //--- InvitesC read rules ---

  test('no-one should be able to read', async () => {

    await Promise.all([
      expect( unauth_invitesC.get() ).toDeny(),   // unauthenticated
      expect( auth_invitesC.get() ).toDeny(),     // valid user (trying to list the invites)

      expect( abc_invitesC.get("a@b.com:1") ).toDeny()   // the one who's created an invite
    ]);
  });

  //--- InvitesC create rules ---

  test('only a member of a project can invite; only author can invite as-author', async () => {
    const template = { email: "aa@b.com", project: "1" };
    const dGen = (uid, asAuthor) => ({ ...template,
      asAuthor: asAuthor, by: uid, at: FieldValue.serverTimestamp()
    });
    const id = `${template.email}:${template.project}`;

    await Promise.all([
      expect( abc_invitesC.doc(id).set( dGen("abc",true )) ).toAllow(),   // author can invite as-author
      expect( abc_invitesC.doc(id).set( dGen("abc",false )) ).toAllow(),  // ..or as collaborator

      expect( def_invitesC.doc(id).set( dGen("def",true )) ).toDeny(),    // collaborator cannot invite as-author
      expect( def_invitesC.doc(id).set( dGen("def",false )) ).toAllow(),  // ..but can as collaborator

      expect( auth_invitesC.doc(id).set( dGen("_",false )) ).toDeny(),    // user not in the project cannot invite to it
      expect( unauth_invitesC.doc(id).set( dGen("_",false )) ).toDeny()    // unauthenticated cannot invite
    ]);
  });

  /*** disabled
  // Enable if this behaviour is needed (for now, we ban inviting someone twice)
  test.skip('one can replace (extend) an existing invite', async () => {
    const d = {
      email: "a@b.com",
      project: "1",
      asAuthor: false,
      by: "abc",
      at: FieldValue.serverTimestamp()
    };
    const id = `${d.email}:${d.project}`;

    await expect( abc_invitesC.doc(id).set(d) ).toAllow();   // overwrites earlier such
  });
  ***/

  test('validity: server time; identifying oneself; \'email:project\' as id', async () => {
    const d = {
      email: "aaa@b.com",
      project: "1",
      asAuthor: false,
      by: "abc",
      at: FieldValue.serverTimestamp()
    };
    const id = `${d.email}:${d.project}`;
    const badId = "blah";

    const dBadTime = { ...d, at: anyDate };
    const dNotMe = { ...d, by: "zwho" };

    await Promise.all([
      expect( abc_invitesC.doc(id).set(d) ).toAllow(),   // re-check valid data gets through
      expect( abc_invitesC.doc(id).set(dBadTime) ).toDeny(),
      expect( abc_invitesC.doc(id).set(dNotMe) ).toDeny(),
      expect( abc_invitesC.doc(badId).set(d) ).toDeny()
    ]);
  });

  //--- InvitesC update rules ---
  //
  // not allowed; not tested

  //--- InvitesC delete rules ---
  //
  // not allowed; not tested
});
