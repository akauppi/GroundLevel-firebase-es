/*
* src/refs/symbols.js
*
* Watch symbols of a certain project.
*
* Used by:
*   - Project page
*/
assert(firebase.firestore);

import { reactive, shallowRef, shallowReactive } from 'vue';
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

  // Note: Thought really hard whether this should be 'ref' or 'reactive'.
  //    - 'ref' generally felt lighter and since our use would be in Vue templates, having to type '.value' is not an issue.
  //    - Vue.js Composition API docs recommends "reactive whenever possible" -> https://composition-api.vuejs.org/#ref-vs-reactive
  //      Having the wrapping object ('symbols') around is not a problem.
  //    - the same recommends 'reactive' when there's an object with many fields, and that's what we have.
  //
  const symbols = reactive( new Map() );

  function handleDoc(doc) {
    const [id, data] = [doc.id, doc.exists ? doc.data() : null];

    console.debug("Handling symbols doc:", doc);

    if (data) {
      console
      // Note: We could just pass 'data' but it's seen useful to passport check the schema in the code.
      //    Also, we can:
      //      - control the depth of reactivity ('shallowReactive')
      //      - transform time stamps to 'Date' (Firestore JavaScript client must have a good excuse, why it is not doing it!!)
      //
      symbols.set(id, {
        layer: data.layer,
        shape: data.shape,
        size: data.size,
        fillColor: data.fillColor,
        center: data.center,    // { x: number, y: number }
        claimed: data.claimed ? { ...data.claimed, at: convertDateValue(data.claimed.at) } : undefined   // { by: uid, at: Date } | undefined
      });

      console.debug(`Symbol ${id} updated`);
    } else {
      symbols.delete(id);

      console.debug(`Symbol ${id} removed`);
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
