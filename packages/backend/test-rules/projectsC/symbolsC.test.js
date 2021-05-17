/*
* back-end/test-rules/projectsC/symbolsC.test.js
*/
import { test, expect, describe, beforeAll } from '@jest/globals'

import { collection, serverTimestamp, deleteField } from 'firebase-jest-testing/firestoreRules'

const SERVER_TIMESTAMP = serverTimestamp();
const DELETE_FIELD = deleteField();

const anyDate = new Date();   // a non-server date

let unauth_symbolsC, auth_symbolsC, abc_symbolsC, def_symbolsC;

beforeAll( () => {
  const coll = collection('projects/1/symbols');

  unauth_symbolsC = coll.as(null);
  auth_symbolsC = coll.as({uid:'_'});
  abc_symbolsC = coll.as({uid:'abc'});
  def_symbolsC = coll.as({uid:'def'});
});

describe("'/projects/.../symbols' rules", () => {

  //--- SymbolsC read rules ---

  test('unauthenticated access should fail', () =>
    expect( unauth_symbolsC.get() ).toDeny()
  );

  test('user who is not part of the project shouldn\'t be able to read', () =>
    expect( auth_symbolsC.get() ).toDeny()
  );

  test('project members may read all symbols', () => Promise.all([
    expect( abc_symbolsC.doc("1").get() ).toAllow(),
    expect( def_symbolsC.doc("1").get() ).toAllow(),   // collaborator

    expect( abc_symbolsC.doc("2-claimed").get() ).toAllow(),
    expect( def_symbolsC.doc("2-claimed").get() ).toAllow()   // collaborator
  ]));

  //--- symbolsC create rules ---
  //
  // note: not testing unauthenticated or non-member access

  test('all members may create; creator needs to claim the symbol to themselves', () => {
    const d = { layer: -6, shape: "star", size: 50, fillColor: "brown", center: { x: 56, y: 78 } };

    const d_claimed = uid => ({ ...d, claimed: { at: SERVER_TIMESTAMP, by: uid } });
    const d_claimed_otherTime = uid => ({ ...d, claimed: { at: anyDate, by: uid } });

    return Promise.all([
      expect( abc_symbolsC.doc("99").set( d )).toDeny(),          // author, not claimed

      expect( abc_symbolsC.doc("99").set( d_claimed("abc") )).toAllow(),     // author, claimed
      expect( def_symbolsC.doc("99").set( d_claimed("def") )).toAllow(),     // collaborator, claimed

      expect( abc_symbolsC.doc("99").set( d_claimed_otherTime("abc") )).toDeny(),     // author, claimed, not server time

      expect( abc_symbolsC.doc("99").set( d_claimed("def") )).toDeny()     // author, claimed to another user
    ]);
  });

  //--- symbolsC update rules ---

  test('members may claim a non-claimed symbol', () => {
    const s1_mod_valid = uid => ({ claimed: { by: uid, at: SERVER_TIMESTAMP } });
    const s1_mod_otherTime = uid => ({ claimed: { by: uid, at: anyDate } });

    return Promise.all([
      expect( abc_symbolsC.doc("1").update( s1_mod_valid("abc") )).toAllow(),     // author
      expect( def_symbolsC.doc("1").update( s1_mod_valid("def") )).toAllow(),     // collaborator
      expect( abc_symbolsC.doc("1").update( s1_mod_otherTime("abc") )).toDeny(),     // bad time
      expect( abc_symbolsC.doc("1").update( s1_mod_valid("def") )).toDeny()      // claiming for another
    ]);
  });

  test('members may do changes to an already claimed (by them) symbol', () => {
    const s2_mod = { size: 999 };

    return Promise.all([
      expect( def_symbolsC.doc("2-claimed").update( s2_mod )).toAllow(),     // claimed by him
      expect( abc_symbolsC.doc("2-claimed").update( s2_mod )).toDeny()      // not claimed by them
    ]);
  });

  // tbd. Cannot figure out why this fails. #help
  test('members may revoke a claim', () => {
    const s2_revoke = { claimed: DELETE_FIELD };

    return Promise.all([
      expect( def_symbolsC.doc("2-claimed").update( s2_revoke )).toAllow(),     // claimed by him
      expect( abc_symbolsC.doc("2-claimed").update( s2_revoke )).toDeny()       // not claimed by them
    ]);
  });

  test('claim cannot be changed (e.g. extended)', () => {
    const s2_extend = { claimed: { by: 'def', at: SERVER_TIMESTAMP } };

    return expect( def_symbolsC.doc("2-claimed").update( s2_extend )).toDeny();     // claimed by him
  });

  //--- symbolsC delete rules ---

  test('members may delete a symbol claimed to themselves', () => Promise.all([

    expect( def_symbolsC.doc("2-claimed").delete()).toAllow(),     // claimed by him
    expect( abc_symbolsC.doc("2-claimed").delete()).toDeny()      // not claimed by them
  ]));

});
