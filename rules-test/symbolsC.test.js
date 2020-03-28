/*
* rules-test/symbolsC.test.js
*/
import { emul } from './emul';
import './tools/jest-matchers';

const assert = require('assert').strict;

const firebase = require('@firebase/testing');

const FieldValue = firebase.firestore.FieldValue;

// IMPORTANT!
//
// Firebase Rules Emulator applies allowed changes to the data. Defining this makes the code revert such changes,
// where needed for further tests to proceed.
//
const ANTIDOTE = true;

describe("'/symbols' rules", () => {
  let unauth_symbolsC, auth_symbolsC, abc_symbolsC, def_symbolsC;

  beforeAll( async () => {         // note: applies only to tests in this describe block

    assert(emul != undefined);
    try {
      unauth_symbolsC = await emul.withAuth().collection('projects/1/symbols');
      auth_symbolsC = await emul.withAuth( { uid: "_" }).collection('projects/1/symbols');
      abc_symbolsC = await emul.withAuth({ uid: "abc" }).collection('projects/1/symbols');
      def_symbolsC = await emul.withAuth( { uid: "def" }).collection('projects/1/symbols');
    }
    catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error( "Failed to initialize the Firebase database: ", err );
      throw err;
    }
  });

  //--- SymbolsC read rules ---

  test('unauthenticated access should fail', async () => {
    await expect( unauth_symbolsC.get() ).toDeny();
  });

  test('user who is not part of the project shouldn\'t be able to read', async () => {
    await expect( auth_symbolsC.get() ).toDeny();
  });

  test('project members may read all symbols', async () => {
    await expect( abc_symbolsC.doc("1").get() ).toAllow();
    await expect( def_symbolsC.doc("1").get() ).toAllow();   // collaborator

    await expect( abc_symbolsC.doc("2-claimed").get() ).toAllow();
    await expect( def_symbolsC.doc("2-claimed").get() ).toAllow();   // collaborator
  });

  //--- symbolsC create rules ---
  //
  // note: not testing unauthenticated or non-member access

  // tbd. fix later
  test.skip('all members may create; creator needs to claim the symbol to themselves', async () => {
    const d = { layer: -6, shape: "star", size: 50, fillColor: "brown", center: { x: 56, y: 78 } };

    const d_claimed = (uid) => ({ ...d, claimed: { at: FieldValue.serverTimestamp(), by: uid } });
    const d_claimed_otherTime = (uid) => ({ ...d, claimed: { at: new Date(), by: uid } });

    await expect( abc_symbolsC.doc("99").set( d )).toDeny();          // author, not claimed

    await expect( abc_symbolsC.doc("99").set( d_claimed("abc") )).toAllow();     // author, claimed
    await expect( def_symbolsC.doc("99").set( d_claimed("def") )).toAllow();     // collaborator, claimed

    await expect( abc_symbolsC.doc("99").set( d_claimed_otherTime("abc") )).toDeny();     // author, claimed, not server time

    await expect( abc_symbolsC.doc("99").set( d_claimed("def") )).toDeny();     // author, claimed to another user
  });

  //--- symbolsC update rules ---

  test.only('members may claim a non-claimed symbol', async () => {
    const s1_mod_valid = uid => ({ claimed: { at: FieldValue.serverTimestamp(), by: uid } });
    const s1_mod_otherTime = uid => ({ claimed: { at: new Date(), by: uid } });

    const p1_s1_original = ANTIDOTE && await abc_symbolsC.doc("1").get().then( snap => snap.data() );

    await expect( abc_symbolsC.doc("1").update( s1_mod_valid("abc") )).toAllow();     // author
    console.debug("!!");

    // Reset the data to its original state (would prefer a Rules Emulator that doesn't apply the allowed changes).
    //
    if (ANTIDOTE) {
      await abc_symbolsC.doc("1").set(p1_s1_original);    // restore it
    }

    console.debug("!!!");
    await expect( def_symbolsC.doc("1").update( s1_mod_valid("def") )).toAllow();     // collaborator

    console.debug("!!!!");
    if (ANTIDOTE) {
      await def_symbolsC.doc("1").set(p1_s1_original);    // restore it
    }

    console.debug("!5");
    await expect( abc_symbolsC.doc("1").update( s1_mod_otherTime("abc") )).toDeny();     // bad time

    console.debug("!6");
    await expect( abc_symbolsC.doc("1").update( s1_mod_valid("def") )).toDeny();     // claiming for another
  });

  test.skip('members may do changes to an already claimed (by them) symbol', async () => { });

  test.skip('members may revoke a claim', async () => { });

  test.skip('claim cannot be changed (e.g. extended)', async () => { });

  //--- symbolsC delete rules ---

  test.skip('members may delete a symbol claimed to themselves', async () => { });

});
