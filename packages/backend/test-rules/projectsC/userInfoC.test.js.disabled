/*
* back-end/test-rules/projectsC/userInfoC.test.js
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { dbAuth, FieldValue } from 'firebase-jest-testing/firestoreReadOnly'

let unauth_projectsC_userInfoC, auth_projectsC_userInfoC, abc_projectsC_userInfoC;

beforeAll( () => {
  try {
    const coll = dbAuth.collection('projects/1/userInfo');

    unauth_projectsC_userInfoC = coll.as(null);
    auth_projectsC_userInfoC = coll.as({uid:'_'});
    abc_projectsC_userInfoC = coll.as({uid:'abc'});
  }
  catch (err) {
    // tbd. How to cancel the tests if we end up here? #help
    console.error( "Failed to initialize the Firebase database: ", err );
    throw err;
  }
});

describe("'/projects/.../userInfo/' rules", () => {
  const dActive = { lastActive: FieldValue.serverTimestamp() };

  //--- ProjectC/UserInfoC read rules ---

  test('unauthenticated access should fail', async () => {
    await expect( unauth_projectsC_userInfoC.get() ).toDeny();
  });

  test('user who is not part of the project shouldn\'t be able to read', async () => {
    await expect( auth_projectsC_userInfoC.get() ).toDeny();
  });

  test('project members may read all symbols', async () => {
    await expect( abc_projectsC_userInfoC.doc("some-uid").get() ).toAllow()
  });

  //--- ProjectC/UserInfoC create rules ---
  //
  // If it happens that the client is first to write to a document, that's fine.

  test('all members may create their own entry', async () => {
    await expect( abc_projectsC_userInfoC.doc("abc").set(dActive) ).toAllow()
  });

  test('one cannot create an entry for another member', async () => {
    await expect( abc_projectsC_userInfoC.doc("stranger").set(dActive) ).toDeny()
  });

  //--- ProjectC/UserInfoC update rules ---

  test('members may update the \'lastActive\' field (of their own doc)', async () => {

    await expect( abc_projectsC_userInfoC.doc("abc").set(dActive, {merge:true}) ).toAllow()
  });

  test('members may not update the \'lastActive\' field of other members', async () => {

    // Both 'abc' and 'def' are in the project.
    await expect( abc_projectsC_userInfoC.doc("def").set(dActive, {merge:true}) ).toDeny()
  });

  test('members may not update fields that Cloud Function updates', async () => {
    const d = { displayName: "ABC" }
    await expect( abc_projectsC_userInfoC.doc("abc").set(d, {merge:true}) ).toDeny()
  });

  //--- ProjectsC/UserInfoC delete rules ---

  test('members may not delete their document', async () => {

    await expect( abc_projectsC_userInfoC.doc("abc").delete() ).toDeny()
  });

});
