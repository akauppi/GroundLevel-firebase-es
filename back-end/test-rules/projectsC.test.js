/*
* back-end/test-rules/projectsC.test.js
*/
import { strict as assert } from 'assert'
import { test, expect, describe, beforeAll } from '@jest/globals'

import { dbAuth } from 'firebase-jest-testing/firestoreTestingReadOnly'
import { FieldValue } from 'firebase-jest-testing/firestoreTesting'

const anyDate = new Date();   // a non-server date

let unauth_projectsC, auth_projectsC, abc_projectsC, def_projectsC, ghi_projectsC;

beforeAll(  () => {
  try {
    const coll = dbAuth.collection('projects');

    unauth_projectsC = coll.as(null);
    auth_projectsC = coll.as({uid:'_'});
    abc_projectsC = coll.as({uid:'abc'});
    def_projectsC = coll.as({uid:'def'});
    ghi_projectsC = coll.as({uid:'ghi'});
  }
  catch (err) {
    // tbd. How to cancel the tests if we end up here? #help
    console.error( "Failed to initialize the Firebase database: ", err );
    throw err;
  }
});

describe("'/projects' rules", () => {

  //--- ProjectsC read rules ---

  test('unauthenticated access should fail', async () => {
    await expect( unauth_projectsC.get() ).toDeny();
  });

  test('user who is not part of the project shouldn\'t be able to read it', async () => {
    await expect( auth_projectsC.get() ).toDeny();
  });

  test('user who is an author or a collaborator can read a project (that is not \'removed\')', async () => {
    await Promise.all([
      expect( abc_projectsC.doc("1").get() ).toAllow(),
      expect( def_projectsC.doc("1").get() ).toAllow()
    ]);
  });

  test('user needs to be an author, to read a \'removed\' project', async () => {
    await Promise.all([
      expect( abc_projectsC.doc("2-removed").get() ).toAllow(),
      expect( def_projectsC.doc("2-removed").get() ).toDeny()
    ]);
  });

  //--- ProjectsC create rules ---

  test('any authenticated user may create a project, but must include themselves as an author', async () => {
    // This implies: unauthenticated users cannot create a project, since they don't have a uid.

    const serverTimestamp = FieldValue.serverTimestamp();
    const p3_valid = {
      title: "Calamity",
      created: serverTimestamp,
      // no 'removed'
      authors: ["abc"],
      members: ["abc"]
    };

    const p3_withoutAuthor = {...p3_valid, authors: [] };
    const p3_badTime = {...p3_valid, created: anyDate };
    const p3_alreadyRemoved = {...p3_valid, removed: serverTimestamp };

    await Promise.all([
      expect( abc_projectsC.doc("3-fictional").set(p3_valid) ).toAllow(),
      expect( abc_projectsC.doc("3-fictional").set(p3_withoutAuthor) ).toDeny(),

      // Time stamp must be the server time
      expect( abc_projectsC.doc("3-fictional").set(p3_badTime) ).toDeny(),

      // May not be already 'removed'
      expect( abc_projectsC.doc("3-fictional").set(p3_alreadyRemoved) ).toDeny()
    ]);
  });

  //--- ProjectsC update rules ---

  test("An author can change '.title'", async () => {
    const p1mod = {
      title: "Calamity 2"
    };
    await Promise.all([
      expect( abc_projectsC.doc("1").update(p1mod) ).toAllow(),
      expect( def_projectsC.doc("1").update(p1mod) ).toDeny()    // collaborator
    ]);
  });

  test("An author can not change the creation time", async () => {
    const p1mod = {
      created: FieldValue.serverTimestamp()
    };
    await Promise.all([
      expect( abc_projectsC.doc("1").update(p1mod) ).toDeny(),
      expect( def_projectsC.doc("1").update(p1mod) ).toDeny()  // collaborator
    ]);
  });

  test("An author can mark a project '.removed'", async () => {
    const p1mod = {
      removed: FieldValue.serverTimestamp()
    };
    await Promise.all([
      expect( abc_projectsC.doc("1").update(p1mod) ).toAllow(),
      expect( def_projectsC.doc("1").update(p1mod) ).toDeny()  // collaborator
    ]);
  });

  test("An author can remove the '.removed' mark", async () => {
    const p2mod = {
      removed: FieldValue.delete()
    };
    await Promise.all( [
      expect( abc_projectsC.doc("2-removed").update(p2mod) ).toAllow(),
      expect( def_projectsC.doc("2-removed").update(p2mod) ).toDeny()  // collaborator
    ]);
  });

  test("An author can add new authors, and remove authors as long as one remains", async () => {
    const p1_addAuthor = {
      authors: FieldValue.arrayUnion("zxy"),
      members: FieldValue.arrayUnion("zxy")   // add also to 'members' since not there, yet
    };
    const p3_removeAuthor = {
      authors: FieldValue.arrayRemove("def")
    };
    const p1_removeAuthor = {
      authors: FieldValue.arrayRemove("abc")    // only author
    };

    await Promise.all([
      expect( abc_projectsC.doc("1").update(p1_addAuthor) ).toAllow(),
      expect( abc_projectsC.doc("3-multiple-authors").update(p3_removeAuthor) ).toAllow(),

      // Possible Firestore emulator bug: if we remove the author with '{ authors: [] }', we are denied.
      //    If we remove it with 'FieldValue.arrayRemove', we are allowed.
      //
      expect( abc_projectsC.doc("1").update(p1_removeAuthor) ).toDeny(),  // only author
      expect( abc_projectsC.doc("1").update( { authors: [] }) ).toDeny(),  // only author

      expect( ghi_projectsC.doc("3-multiple-authors").update(p3_removeAuthor) ).toDeny()  // collaborator
    ]);
  });

  /*
  * Likely gets removed. Adding new users to a project would be the work of Cloud Functions, as part of invites.
  *
  test("An author can add or remove collaborators", async () => {
    const p1_addCollaborator = {
      members: FieldValue.arrayUnion("xyz")
    };
    await expect( abc_projectsC.doc("1").update(p1_addCollaborator) ).toAllow();
    await expect( def_projectsC.doc("1").update(p1_addCollaborator) ).toDeny();   // collaborator

    // not testing removal - we likely toss this away?
  });
  */

  //--- ProjectsC delete rules ---

  test('no user should be able to delete a project (only cloud functions or manual)', async () => {
    await expect( abc_projectsC.doc("1").delete() ).toDeny();   // is an author in that project
  });
});

