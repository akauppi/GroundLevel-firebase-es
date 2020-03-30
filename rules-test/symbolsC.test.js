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
// Firebase Rules Emulator applies allowed changes to the data. This was a surprise - some tests are skipped
// because of this. We do aim at an immutable-dataset approach.

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

  test.skip('members may claim a non-claimed symbol', async () => {
    const s1_mod_valid = uid => ({ claimed: { at: FieldValue.serverTimestamp(), by: uid } });
    const s1_mod_otherTime = uid => ({ claimed: { at: new Date(), by: uid } });

    await expect( abc_symbolsC.doc("1").update( s1_mod_valid("abc") )).toAllow();     // author
    await expect( def_symbolsC.doc("1").update( s1_mod_valid("def") )).toAllow();     // collaborator
    await expect( abc_symbolsC.doc("1").update( s1_mod_otherTime("abc") )).toDeny();     // bad time
    await expect( abc_symbolsC.doc("1").update( s1_mod_valid("def") )).toDeny();     // claiming for another

    //With new approach:  CONCEPT
    //await expect( abc_symbolsC.doc("1").update( s1_mod_valid("abc") )).toAllow();     // author
    //await expect( symbolsC.as("abc").doc("1").update( s1_mod_valid("abc") )).toAllow();     // author
  });

  test('members may do changes to an already claimed (by them) symbol', async () => {
    const s2_mod = { size: 999 };

    await expect( def_symbolsC.doc("2-claimed").update( s2_mod )).toAllow();     // claimed by him
    await expect( abc_symbolsC.doc("2-claimed").update( s2_mod )).toDeny();     // not claimed by them
  });

  test('members may revoke a claim', async () => {
    const s2_revoke = { claimed: FieldValue.delete() };

    await expect( def_symbolsC.doc("2-claimed").update( s2_revoke )).toAllow();     // claimed by him
    await expect( abc_symbolsC.doc("2-claimed").update( s2_revoke )).toDeny();      // not claimed by them
  });

  test.skip('claim cannot be changed (e.g. extended)', async () => {
    const s2_extend = { claimed: FieldValue.serverTimestamp() };

    await expect( def_symbolsC.doc("2-claimed").update( s2_extend )).toDeny();     // claimed by him
  });

  //--- symbolsC delete rules ---

  test.skip('members may delete a symbol claimed to themselves', async () => {

    await expect( def_symbolsC.doc("2-claimed").delete()).toAllow();     // claimed by him
    await expect( abc_symbolsC.doc("2-claimed").delete()).toDeny();     // not claimed by them
  });

});
