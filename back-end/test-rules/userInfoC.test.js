/*
* back-end/test-rules/userInfoC.test.js
*/
import { strict as assert } from 'assert'
import { test, expect, describe, beforeAll } from '@jest/globals'

import { dbAuth } from 'firebase-jest-testing/firestoreReadOnly';

describe("'/userInfo' rules", () => {
  let unauth_userinfoC, abc_userinfoC, def_userinfoC;

  beforeAll( async () => {    // tbd. remove 'async' when all tests pass
    try {
      const coll = dbAuth.collection('userInfo');   // root collection

      unauth_userinfoC = coll.as(null);
      abc_userinfoC = coll.as({uid:'abc'});
      def_userinfoC = coll.as({uid:'def'});

      assert(unauth_userinfoC && abc_userinfoC && def_userinfoC);
    }
    catch (err) {
      // tbd. How to cancel the tests if we end up here? #help
      console.error( "Failed to initialize the database: ", err );    // not happened
      throw err;
    }
  });

  //--- UserInfoC read rules ---

  test('no-one should be able to read', async () => {

    await Promise.all([
      expect( unauth_userinfoC.get("abc") ).toDeny(),   // unauthenticated
      expect( abc_userinfoC.get("abc") ).toDeny(),     // valid user (cannot read even one's own)
    ]);
  });

  //--- UserInfoC write (create/update) rules ---

  test('only the user themselves can write the info', async () => {
    const template = {name: "Joe D.", photoURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4a9529e8-cf9b-4b7b-a70d-ad27fd90ae1c/d82q14m-38f53f31-ab2e-4ee2-9968-29279f3e1e77.jpg/v1/fill/w_1024,h_1327,q_75,strp/joe_dalton_by_mirinata_d82q14m-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNGE5NTI5ZTgtY2Y5Yi00YjdiLWE3MGQtYWQyN2ZkOTBhZTFjXC9kODJxMTRtLTM4ZjUzZjMxLWFiMmUtNGVlMi05OTY4LTI5Mjc5ZjNlMWU3Ny5qcGciLCJoZWlnaHQiOiI8PTEzMjciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS53YXRlcm1hcmsiXSwid21rIjp7InBhdGgiOiJcL3dtXC80YTk1MjllOC1jZjliLTRiN2ItYTcwZC1hZDI3ZmQ5MGFlMWNcL21pcmluYXRhLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.n5RXKj_82CFhD3Aq9JNGYD8EhCxa0KRv7XA4qFr3mTQ"};

    // create
    await Promise.all([
      expect(unauth_userinfoC.doc("abc").set(template)).toDeny(),   // unauthenticated
      expect(abc_userinfoC.doc("abc").set(template)).toAllow(),     // user themselves
      expect(def_userinfoC.doc("abc").set(template)).toDeny(),     // another user
    ]);

    // update
    await Promise.all([
      expect(unauth_userinfoC.doc("def").set(template)).toDeny(),   // unauthenticated
      expect(abc_userinfoC.doc("def").set(template)).toDeny(),     // another user
      expect(def_userinfoC.doc("def").set(template)).toAllow(),     // user themselves
    ]);
  });

  //--- UserInfoC delete rules ---

  // not tested; if a user hacks to remove their own info that's fine
});
