const { setup, teardown } = require('./setup');
const { assertFails, assertSucceeds } = require('@firebase/testing');

require('./jest-matchers');

describe('Project rules', () => {
  let projectsC = {};

  beforeAll(async () => {         // note: applies only to tests in this describe block
    projectsC.unsigned = await setup({ uid: null }).then( db => db.collection('projects') );
    projectsC.abc = await setup( { uid: "abc" }).then( db => db.collection('projects') );
    projectsC.def = await setup( { uid: "def" }).then( db => db.collection('projects') );
  });

  // Nope? Don't tear down so coverage results remain in the emulator API.
  /*
  afterAll(async () => {
    await teardown();
  });
  */

  test('unauthorized access should fail', async () => {

    await expect( projectsC_unsigned.get("1") ).toDeny();
  });
});