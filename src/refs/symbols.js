/*
* src/refs/symbols.js
*
* Watch symbols of a certain project.
*
* Used by:
*   - Project page
*/
assert(firebase.firestore);

import { reactive } from 'vue';
import { convertDateValue, unshot } from "../firebase/utils";

const db = firebase.firestore();

// {symbol-id}: {
//    layer: int
//    shape: "star"      // potentially more shapes
//    size: int
//    fillColor: string
//    center: { x: number, y: number }
//    claimed: { by: uid, at: timestamp }
// }

let active = false;   // safeguard to disallow tracking two projects at once

/*
* Track a certain project's symbols
*/
function symbolsSub(projectId) {    // (string) => [reactive of { <symbol-id>: {...} }, unsub: () => ()]
  if (active) {
    throw new Error("Missing 'unsub'? Trying to subscribe two projects' symbols, at once.");
  }

  const symbolsC = db.collection(`projects/${projectId}/symbols`);

  // Note: We likely only need one level of reactivity (depends on the application code)
  //
  // tbd. limit the reactivity to be shallow (for performance?)
  //
  const symbols = reactive( new Map() );

  function handleDoc(doc) {
    const [id, data] = [doc.id, doc.exists ? doc.data() : null];

    if (data) {
      // Note: We could just pass 'data' but it's seen useful to passport check the schema in the code (adding more
      //      fields in the data does not automatically expose them to the application).
      //
      symbols.set(id, {
        layer: data.layer,
        shape: data.shape,
        size: data.size,
        fillColor: data.fillColor,
        center: data.center,    // { x: number, y: number }
        claimed: data.claimed ? { ...data.claimed, at: convertDateValue(data.claimed.at) } : undefined   // { by: uid, at: Date } | undefined
      });
    } else {
      symbols.delete(id);
    }
  }

  const unsub = symbolsC.onSnapshot( unshot(handleDoc) )
  active = true;

  return [symbols, () => {
    assert(active);
    active = false;
    unsub();
  }];
}

export {
  symbolsSub
}
