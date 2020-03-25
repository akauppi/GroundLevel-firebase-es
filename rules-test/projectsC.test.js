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

// HELP! For some reason, not able to make 'beforeAll()' return a promise. Can you do the below without using 'done'?
// #help

beforeAll( async (done) => {    // set up all collections
  // The session id (Firebase calls it 'project id') used by the emulator. Also needed for seeing coverage reports
  //  -> http://localhost:6767/emulator/v1/projects/<test_id>:ruleCoverage.html
  //
  // Sessions persist on a single emulator run. We use a date so that we'll get fresh stuff each run.
  //
  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1583506734171'

  emul = await setup(sessionId, data);

  console.info("Emulation session: ", sessionId);

  done();
  //return true;    // return anything, to make Jest get a promise (did not work)
});

// Note: We may wish to leave them in the server, to see coverage reports.
//
afterAll( async (done) => {    // clean up all collections
  await emul.teardown();
  console.log("Cleaned up!");
  done();
  //return true;
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

  test('unauthenticated access should fail', async (done) => {
    await expect( unauth_projectsC.get() ).toDeny();

    done();
    //return true;
  });

  test('user who is not part of the project shouldn\'t be able to read it', async (done) => {
    await expect( auth_projectsC.get() ).toDeny();

    done();
    //return true;
  });

  test.only('user who is an author or a collaborator can read a project (that is not \'removed\')', async (done) => {
    await expect( abc_projectsC.doc("1").get() ).toAllow();
    await expect( def_projectsC.doc("1").get() ).toAllow();

    done();
    //return true;
  });

  /*** pending
  test('user needs to be an author, to read a \'removed\' project', async (done) => {
    await expect( abc_projectsC.get("1") ).toAllow();
    await expect( def_projectsC.get("1") ).toAllow();

    done();
    //return true;
  });
  ***/



  /*** KEEP AT END
  test('designed to fail!', async (done) => {       // DEBUG
    await expect( unauth_projectsC.get() ).toAllow();
    done();
    //return true;
  });
  ***/
});