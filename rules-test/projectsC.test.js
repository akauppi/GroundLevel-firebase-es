/*
* rules-test/projectsC.test.js
*
* Rules tests
*/
import { setup } from './tools/setup';
import './tools/jest-matchers';

import { data } from './data';

const assert = require('assert').strict;

let emul;

const firebase = require('@firebase/testing');

beforeAll( async () => {    // set up all collections
  // The session id (Firebase calls it 'project id') used by the emulator. Also needed for seeing coverage reports
  //  -> http://localhost:6767/emulator/v1/projects/<test_id>:ruleCoverage.html
  //
  // Sessions persist on a single emulator run. We use a date so that we'll get fresh stuff each run.
  //
  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1583506734171'

  emul = await setup(sessionId, data);

  console.info("Emulation session: ", sessionId);
});

// Note: We may wish to leave them in the server, to see coverage reports.
//
afterAll( async () => {    // clean up all collections
  await emul.teardown();
  console.log("Cleaned up!");
});

describe("Project rules", () => {
  let unauth_projectsC, auth_projectsC, abc_projectsC, def_projectsC;

  beforeAll( async () => {         // note: applies only to tests in this describe block
    try {
      unauth_projectsC = await emul.withAuth().collection('projects');
      auth_projectsC = await emul.withAuth( { uid: "_" }).collection('projects');
      abc_projectsC = await emul.withAuth({ uid: "abc" }).collection('projects');
      def_projectsC = await emul.withAuth( { uid: "def" }).collection('projects');

      console.log("Database initialized for three access patterns");
      return true;
    }
    catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error( "Failed to initialize the Firebase database: "+ err );
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

    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

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



  //--- other ---

  /*** KEEP AT END
  test('designed to fail!', async () => {       // DEBUG
    await expect( unauth_projectsC.get() ).toAllow();
  });
  ***/
});