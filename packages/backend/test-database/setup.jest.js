/*
* test-database-rules/setup.jest.js
*
* Global setup, before the tests are loaded.
*/

const setup = _ => {

  // Firebase docs only advice this way to talk (from admin client) to the Realtime Database; using an env.var.
  //
  // It does not matter. The (10.3.0) firebase-admin requires a '.databaseURL' and things start to work..
  //
  //process.env["FIREBASE_DATABASE_EMULATOR_HOST"] ="localhost:6800";
}

export default setup;
