/*
* test-fns/counters.test.js
*
* Test global counters, used for collecting operational metrics.
*/
import { test, expect, describe } from '@jest/globals'

import { httpsCallable } from 'firebase-jest-testing/firebaseClientLike'

const COUNTER_PATH="/_counters"

import { doc as adminDoc } from 'firebase-jest-testing/firestoreAdmin'

describe ('Can proxy counter increments', () => {

  const name = "abc";
  const name2 = "def";

  test('can increment counters (from scratch)', async () => {

    await fnCount(name, 1.0, { testing: "true" });

    const x = await readCounter(name);    // { "": 1.0, "testing=true": 1.0 }
    expect(x).toEqual({
      "=": 1.0,
      "testing=true": 1.0
    });
  })

  test('can increment counters (on top of earlier values)', async () => {

    await fnCount(name, 1.0, { testing: "true", fox: "yes" });

    const x = await readCounter(name);
    expect(x).toEqual({
      "=": 2.0,
      "testing=true": 2.0,
      "fox=yes": 1.0
    });
  })

  test('counters don\'t cross-pollunate', async () => {

    await fnCount(name2, 1.0);

    const x = await readCounter(name);
    expect(x).toEqual(
      expect.objectContaining({
        "=": 2.0,
        "testing=true": 2.0
      }
    ));

    const y = await readCounter(name2);    // { "": 1.0 }
    expect(y).toEqual({
      "=": 1.0
    });
  })

});
  // DC (mac; DC 4.9.0):
  //  - no warm-up; cold emul:  4436, 5667 ms
  //  - warmed up; cold emul:    298 ms
  //
  // CI (DC):
  //  - no warm-up:              xxx ms     # warm-up disabled by editing the DC yml
  //  - warmed up:               xxx ms

/*
* Read a certain counter's object, for comparisons.
*/
async function readCounter(name) {
  const o = await adminDoc(`${COUNTER_PATH}/${name}`).get();

  return o.exists ? o.data() : undefined;
}

/*
* Wrapper around the callable; throws if there's a 'HttpError'.
*/
const fnCount2 = httpsCallable("counterProxy_v0");   // ({ name: string, diff: number, tags: { <k>: <v> }|undefined}) => Promise of { data: any?, error: object? }

async function fnCount(name, diff, tags) {    // (name: string, diff: number, tags: { <k>:<v> }?) => Promise of ()

  await fnCount2({ name, diff, tags }).then( ({ data, error }) => {
    expect(error).toBeUndefined();    // gives a decent error message
  })
}