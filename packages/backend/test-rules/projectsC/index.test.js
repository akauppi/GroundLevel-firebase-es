/*
* back-end/test-rules/projectsC/index.test.js
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { collection, arrayRemove, arrayUnion, serverTimestamp, deleteField } from 'firebase-jest-testing/firestoreRules'

const SERVER_TIMESTAMP = serverTimestamp();
const DELETE_FIELD = deleteField();

const anyDate = new Date();   // a non-server date

let unauth_projectsC, auth_projectsC, abc_projectsC, def_projectsC, ghi_projectsC;

beforeAll(  () => {
  const coll = collection('projects');

  unauth_projectsC = coll.as(null);
  auth_projectsC = coll.as({uid:'_'});
  abc_projectsC = coll.as({uid:'abc'});
  def_projectsC = coll.as({uid:'def'});
  ghi_projectsC = coll.as({uid:'ghi'});
});

describe("'/projects' rules", () => {

  //--- ProjectsC read rules ---

  test('unauthenticated access should fail', async () => {
    await expect( unauth_projectsC.get() ).toDeny();
  });

  test('user who is not part of the project shouldn\'t be able to read it', async () => {
    await expect( auth_projectsC.get() ).toDeny();
  });

  test('user who is an author or a collaborator can read a project (that is not \'removed\')', () => Promise.all([
    expect( abc_projectsC.doc("1").get() ).toAllow(),
    expect( def_projectsC.doc("1").get() ).toAllow()
  ]));

  test('user needs to be an author, to read a \'removed\' project', () => Promise.all([
    expect( abc_projectsC.doc("2-removed").get() ).toAllow(),
    expect( def_projectsC.doc("2-removed").get() ).toDeny()
  ]));

  //--- ProjectsC create rules ---

  test('any authenticated user may create a project, but must include themselves as an author', () => {
    // implies: unauthenticated users cannot create a project, since they don't have a uid.

    const p3_valid = {
      title: "Calamity",
      created: SERVER_TIMESTAMP,
      // no 'removed'
      authors: ["abc"],
      members: ["abc"]
    };

    const p3_withoutAuthor = {...p3_valid, authors: [] };
    const p3_badTime = {...p3_valid, created: anyDate };
    const p3_alreadyRemoved = {...p3_valid, removed: SERVER_TIMESTAMP };

    return Promise.all([
      expect( abc_projectsC.doc("3-fictional").set(p3_valid) ).toAllow(),
      expect( abc_projectsC.doc("3-fictional").set(p3_withoutAuthor) ).toDeny(),

      // Time stamp must be the server time
      expect( abc_projectsC.doc("3-fictional").set(p3_badTime) ).toDeny(),

      // May not be already 'removed'
      expect( abc_projectsC.doc("3-fictional").set(p3_alreadyRemoved) ).toDeny()
    ]);
  });

  //--- ProjectsC update rules ---

  test("An author can change '.title'", () => {
    const p1mod = {
      title: "Calamity 2"
    };
    return Promise.all([
      expect( abc_projectsC.doc("1").update(p1mod) ).toAllow(),
      expect( def_projectsC.doc("1").update(p1mod) ).toDeny()    // collaborator
    ]);
  });

  test("An author can not change the creation time", () => {
    const p1mod = {
      created: SERVER_TIMESTAMP
    };
    return Promise.all([
      expect( abc_projectsC.doc("1").update(p1mod) ).toDeny(),
      expect( def_projectsC.doc("1").update(p1mod) ).toDeny()  // collaborator
    ]);
  });

  test("An author can mark a project '.removed'", () => {
    const p1mod = {
      removed: SERVER_TIMESTAMP
    };
    return Promise.all([
      expect( abc_projectsC.doc("1").update(p1mod) ).toAllow(),
      expect( def_projectsC.doc("1").update(p1mod) ).toDeny()  // collaborator
    ]);
  });

  test("An author can remove the '.removed' mark", () => {
    const p2mod = {
      removed: DELETE_FIELD
    };
    return Promise.all( [
      expect( abc_projectsC.doc("2-removed").update(p2mod) ).toAllow(),
      expect( def_projectsC.doc("2-removed").update(p2mod) ).toDeny()  // collaborator
    ]);
  });

  test("An author can add new authors, and remove authors as long as one remains", () => {
    const p1_addAuthor = {
      authors: arrayUnion("zxy"),
      members: arrayUnion("zxy")   // add also to 'members' since not there, yet
    };
    const p3_removeAuthor = {
      authors: arrayRemove("def")
    };
    const p1_removeAuthor = {
      authors: arrayRemove("abc")    // only author
    };

    return Promise.all([
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

  test('no user should be able to delete a project (only cloud functions or manual)', () => (
    expect( abc_projectsC.doc("1").delete() ).toDeny()   // is an author in that project
  ));
});
