const { assertFails, assertSucceeds } = require('@firebase/testing');

const assert = require('assert').strict;

import { setup } from './tools/setup';
import './tools/jest-matchers';

import { data } from './data';

let emul;

// Help: For some reason, not able to make 'beforeAll()' return a promise. Can you do the below without using 'done'? #help

beforeAll( async (done) => {    // set up all collections
  // The session id (Firebase calls it 'project id') used by the emulator. Also needed for seeing coverage reports
  //  -> http://localhost:6767/emulator/v1/projects/<test_id>:ruleCoverage.html
  //
  // Note: Sessions persist on a single emulator run. Having the date so that we'll get fresh stuff each run.
  //
  const sessionId = `test-${Date.now()}`;   // e.g. 'test-1583506734171'

  emul = await setup(sessionId, data);

  console.info("Emulation session: ", sessionId);

  done();
  //return true;    // return anything, to make Jest get a promise
});

// Note: We may wish to leave them in the server, to see coverage reports.
//
/***
afterAll( async () => {    // clean up all collections
  await emul.teardown();
});
***/

describe("Project rules", () => {
  let unauth_projectsC, abc_projectsC, def_projectsC;

  beforeAll( async () => {         // note: applies only to tests in this describe block
    try {
      unauth_projectsC = await emul.withAuth().collection('projects');
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

  test('unauthorized access should fail', async (done) => {
    //assert( Object.keys(projectsC).length > 0 );    // REMOVE

    await expect( unauth_projectsC.get() ).toDeny();

    done();
    //return true;
  });
});