/*
* rules-test/projectsC.test.js
*
* Rules tests
*
* tbd. Waiting for many tests could happen in parallel, maybe speeding up execution
*     (inside the tests, if there are multiple `await`s). #contribute #optimization
*     ^-- If you do that, check the execution time before and after.
*/
import './tools/jest-matchers';
import { emul } from './emul';

const assert = require('assert').strict;

const firebase = require('@firebase/testing');

const FieldValue = firebase.firestore.FieldValue;

describe("'/projects' rules", () => {
  let unauth_projectsC, auth_projectsC, abc_projectsC, def_projectsC;

  beforeAll( async () => {         // note: applies only to tests in this describe block

    assert(emul != undefined);
    try {
      unauth_projectsC = await emul.withAuth().collection('projects');
      auth_projectsC = await emul.withAuth( { uid: "_" }).collection('projects');
      abc_projectsC = await emul.withAuth({ uid: "abc" }).collection('projects');
      def_projectsC = await emul.withAuth( { uid: "def" }).collection('projects');
    }
    catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error( "Failed to initialize the Firebase database: ", err );
      throw err;
    }
  });

  //--- ProjectsC read rules ---

  test('unauthenticated access should fail', async () => {
    await expect( unauth_projectsC.get() ).toDeny();
  });

  test('user who is not part of the project shouldn\'t be able to read it', async () => {
    await expect( auth_projectsC.get() ).toDeny();
  });

  test('user who is an author or a collaborator can read a project (that is not \'removed\')', async () => {
    await expect( abc_projectsC.doc("1").get() ).toAllow();
    await expect( def_projectsC.doc("1").get() ).toAllow();
  });

  test('user needs to be an author, to read a \'removed\' project', async () => {
    await expect( abc_projectsC.doc("2-removed").get() ).toAllow();
    await expect( def_projectsC.doc("2-removed").get() ).toDeny();
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
      collaborators: []
    };

    const p3_withoutAuthor = {...p3_valid, authors: [] };
    const p3_badTime = {...p3_valid, created: Date.now() };
    const p3_alreadyRemoved = {...p3_valid, removed: serverTimestamp };

    await expect( abc_projectsC.doc("3-fictional").set(p3_valid) ).toAllow();
    await expect( abc_projectsC.doc("3-fictional").set(p3_withoutAuthor) ).toDeny();

    // Time stamp must be the server time
    await expect( abc_projectsC.doc("3-fictional").set(p3_badTime) ).toDeny();

    // May not be already 'removed'
    await expect( abc_projectsC.doc("3-fictional").set(p3_alreadyRemoved) ).toDeny();
  });

  //--- ProjectsC update rules ---

  test("An author can change '.title'", async () => {
    const p1mod = {
      title: "Calamity 2"
    };
    await expect( abc_projectsC.doc("1").update(p1mod) ).toAllow();
    await expect( def_projectsC.doc("1").update(p1mod) ).toDeny();    // collaborator
  });

  test("An author can not change the creation time", async () => {
    const p1mod = {
      created: FieldValue.serverTimestamp()
    };
    await expect( abc_projectsC.doc("1").update(p1mod) ).toDeny();
    await expect( def_projectsC.doc("1").update(p1mod) ).toDeny();  // collaborator
  });

  test("An author can mark a project '.removed'", async () => {
    const p1mod = {
      removed: FieldValue.serverTimestamp()
    };
    await expect( abc_projectsC.doc("1").update(p1mod) ).toAllow();
    await expect( def_projectsC.doc("1").update(p1mod) ).toDeny();  // collaborator
  });

  test("An author can remove the '.removed' mark", async () => {
    const p2mod = {
      removed: FieldValue.delete()
    };
    await expect( abc_projectsC.doc("2-removed").update(p2mod) ).toAllow();
    await expect( def_projectsC.doc("2-removed").update(p2mod) ).toDeny();  // collaborator
  });

  /***
  test("An author can add new authors, and remove authors as long as one remains", async () => {
    const p1mod = {
      authors:
    };
    await expect( abc_projectsC.doc("2").update(p2mod) ).toAllow();

    // removing authors needs a new test case '3'
  });
  ***/

  //--- ProjectsC delete rules ---

  test('no user should be able to delete a project (only cloud functions or manual)', async () => {
    await expect( abc_projectsC.doc("1").delete() ).toDeny();   // is an author in that project
  });
});


/*** KEEP AT END
 test('designed to fail!', async () => {       // DEBUG
    await expect( unauth_projectsC.get() ).toAllow();
  });
 ***/
