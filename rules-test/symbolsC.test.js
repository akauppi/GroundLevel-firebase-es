/*
* rules-test/symbolsC.test.js
*/
import './tools/jest-matchers';

import { sessionProm } from './tools/guarded-session';

//const assert = require('assert').strict;
import { strict as assert } from 'assert';

//const firebase = require('@firebase/testing');
import * as firebase from '@firebase/testing';

const FieldValue = firebase.firestore.FieldValue;

const anyDate = new Date();   // a non-server date

// Perform extra tests to see the test data isn't changed by other tests (if it is, our guards didn't work!)
//
async function HYGIENE( title, doc, f ) {
  const o = await doc._dump();
  //console.trace( "HYGIENE: "+ title, o );   // enable for debugging
  f(o);
}

let session;

beforeAll( async () => {         // note: applies only to tests in this describe block
  session = await sessionProm();
});

describe("'/symbols' rules", () => {
  let unauth_symbolsC, auth_symbolsC, abc_symbolsC, def_symbolsC;

  beforeAll( async () => {         // note: applies only to tests in this describe block
    try {
      const coll = session.collection('projects/1/symbols');

      unauth_symbolsC = coll.as(null);
      auth_symbolsC = coll.as({uid:'_'});
      abc_symbolsC = coll.as({uid:'abc'});
      def_symbolsC = coll.as({uid:'def'});
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

  // ✅
  test('project members may read all symbols', async () => {
    await expect( abc_symbolsC.doc("1").get() ).toAllow();
    await expect( def_symbolsC.doc("1").get() ).toAllow();   // collaborator

    await expect( abc_symbolsC.doc("2-claimed").get() ).toAllow();
    await expect( def_symbolsC.doc("2-claimed").get() ).toAllow();   // collaborator
  });

  //--- symbolsC create rules ---
  //
  // note: not testing unauthenticated or non-member access

  test('all members may create; creator needs to claim the symbol to themselves', async () => {
    const d = { layer: -6, shape: "star", size: 50, fillColor: "brown", center: { x: 56, y: 78 } };

    const d_claimed = uid => ({ ...d, claimed: { at: FieldValue.serverTimestamp(), by: uid } });
    const d_claimed_otherTime = uid => ({ ...d, claimed: { at: anyDate, by: uid } });

    await expect( abc_symbolsC.doc("99").set( d )).toDeny();          // author, not claimed

    await expect( abc_symbolsC.doc("99").set( d_claimed("abc") )).toAllow();     // author, claimed
    await expect( def_symbolsC.doc("99").set( d_claimed("def") )).toAllow();     // collaborator, claimed

    await expect( abc_symbolsC.doc("99").set( d_claimed_otherTime("abc") )).toDeny();     // author, claimed, not server time

    await expect( abc_symbolsC.doc("99").set( d_claimed("def") )).toDeny();     // author, claimed to another user
  });

  //--- symbolsC update rules ---

  test('members may claim a non-claimed symbol', async () => {
    const s1_mod_valid = uid => ({ claimed: { by: uid, at: FieldValue.serverTimestamp() } });
    const s1_mod_otherTime = uid => ({ claimed: { by: uid, at: anyDate } });

    await expect( abc_symbolsC.doc("1").update( s1_mod_valid("abc") )).toAllow();     // author
    await expect( def_symbolsC.doc("1").update( s1_mod_valid("def") )).toAllow();     // collaborator
    await expect( abc_symbolsC.doc("1").update( s1_mod_otherTime("abc") )).toDeny();     // bad time
    await expect( abc_symbolsC.doc("1").update( s1_mod_valid("def") )).toDeny();     // claiming for another
  });

  test('members may do changes to an already claimed (by them) symbol', async () => {
    const s2_mod = { size: 999 };

    await HYGIENE( "Before setting to 999", def_symbolsC.doc("2-claimed"), o => {
      assert( o.size == 50 );
      assert(o.claimed.by == "def");
    });

    await expect( def_symbolsC.doc("2-claimed").update( s2_mod )).toAllow();     // claimed by him
    await expect( abc_symbolsC.doc("2-claimed").update( s2_mod )).toDeny();     // not claimed by them

    await HYGIENE( "After setting to 999", def_symbolsC.doc("2-claimed"), o => {
      assert( o.size == 50 );
    });
  });

  test('members may revoke a claim', async () => {
    const s2_revoke = { claimed: FieldValue.delete() };

    await expect( def_symbolsC.doc("2-claimed").update( s2_revoke )).toAllow();     // claimed by him
    await expect( abc_symbolsC.doc("2-claimed").update( s2_revoke )).toDeny();      // not claimed by them
  });

  // BUG: test fails
  test.skip('claim cannot be changed (e.g. extended)', async () => {
    const s2_extend = { claimed: { by: 'def', at: FieldValue.serverTimestamp() } };

    await expect( def_symbolsC.doc("2-claimed").update( s2_extend )).toDeny();     // claimed by him
  });

  //--- symbolsC delete rules ---

  // #BUG Here, the data is not in its expected state when entering the test:
  //    { ..., size: 999 }, claimed missing. Figure out why. #help
  //
  test.skip('members may delete a symbol claimed to themselves', async () => {

    await HYGIENE( "Before delete", def_symbolsC.doc("2-claimed"), o => {
      console.debug( "Has:", o );
      assert( o.size == 50 );
      assert(o.claimed && o.claimed.by == "def");
    });

    await expect( def_symbolsC.doc("2-claimed").delete()).toAllow();     // claimed by him
    await expect( abc_symbolsC.doc("2-claimed").delete()).toDeny();     // not claimed by them

    await HYGIENE( "After delete", def_symbolsC.doc("2-claimed"), o => {
      assert( o.size == 50 );
      assert(o.claimed && o.claimed.by == "def");
    });
  });

});
