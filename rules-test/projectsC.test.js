/*
* rules-test/projectsC.test.js
*
* Rules tests
*
* tbd. Waiting for many tests could happen in parallel, maybe speeding up execution
*     (inside the tests, if there are multiple `await`s). #contribute #optimization
*     ^-- If you do that, check the execution time before and after.
*/
import { setup } from './tools/setup';
import './tools/jest-matchers';

import { data } from './data';

const assert = require('assert').strict;

let emul;

const firebase = require('@firebase/testing');

const FieldValue = firebase.firestore.FieldValue;
const serverTimestamp = FieldValue.serverTimestamp();

beforeAll( async () => {    // set up all collections

  // The session id (Firebase calls it 'project id') used by the emulator. Also needed for seeing coverage reports
  //  -> http://localhost:6767/emulator/v1/projects/<session_id>:ruleCoverage.html
  //
  // Sessions persist on a single emulator run.(*!!) We use a date so that we'll get fresh stuff each run.
  //
  // (*!!): This is what Firebase docs say (link, please!), but in practise they seem to survive past
  //    emulator restarts. What's uP?
  //
  // Note: Tried with a static sessionId and got to problems, right away.
  //
  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1583506734171'

  try {
    emul = await setup(sessionId, data);
  }
  catch (err) {
    console.error( "Failed to initialize the Firebase emulator: ", err );
    throw err;
  }

  console.info("Emulation session: ", sessionId);
});

afterAll( async () => {    // clean up all collections (without this, the tests won't finish)
  assert(emul != undefined);
  await emul.teardown();
});

describe("Project rules", () => {
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

  // tbd. This seems to pass with the Online Simulator. Weird. 😕
  //
  test.skip("An author can change '.title'", async () => {
    const p1mod = {
      title: "Calamity 2"
    };
    await expect( abc_projectsC.doc("1").update(p1mod) ).toAllow();
    await expect( def_projectsC.doc("1").update(p1mod) ).toDeny();    // collaborator
  });

  test("An author can not change the creation time", async () => {
    const p1mod = {
      created: serverTimestamp
    };
    await expect( abc_projectsC.doc("1").update(p1mod) ).toDeny();
    await expect( def_projectsC.doc("1").update(p1mod) ).toDeny();  // collaborator
  });

  // - Fails on local emulator (firebase tools v.7.16.1)
  // - Not testable with online Simulator (it does not allow setting a value to `FieldValue.*`).
  //
  test.skip("An author can mark a project '.removed'", async () => {
    const p1mod = {
      removed: serverTimestamp
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
