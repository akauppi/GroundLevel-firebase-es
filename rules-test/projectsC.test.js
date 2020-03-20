import { setup, teardown } from './setup';
const { assertFails, assertSucceeds } = require('@firebase/testing');

//require('./jest-matchers');
const assert = require('assert').strict;

describe('Project rules', () => {
  const projectsC = new Map();

  beforeAll( async () => {         // note: applies only to tests in this describe block

    try {
      projectsC.unsigned = await setup().then( db => db.collection('projects') );
      projectsC.abc = await setup( { uid: "abc" }).then( db => db.collection('projects') );
      projectsC.def = await setup( { uid: "def" }).then( db => db.collection('projects') );

      console.log("Database initialized for three access patterns");
      return true;
    }
    catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error( "Failed to initialize the Firebase database: "+ err );
      throw err;
    }
  });

  // Nope? Don't tear down so coverage results remain in the emulator API.
  /*
  afterAll(async () => {
    await teardown();
  });
  */

  assert( projectsC.keys.length > 0 );

  test('unauthorized access should fail', async () => {

    // Why is 'projectsC' empty, here?? BUG!
    console.log("!!!", projectsC);   // should not be empty

    expect.assertions(1);
    try {
      await projectsC.unsigned.get("1");
    } catch(e) {
      expect(e).toBe(123);
    }

    //await expect( projectsC.unsigned.get("1") ).toDeny();
  });
});