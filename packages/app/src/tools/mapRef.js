/*
* src/tools/refMap.js
*
* A 'Ref of Map' implementation.
*/
import { shallowRef, triggerRef } from 'vue'

/*
* Return a 'Ref' for a map of key -> values, and a function to set those values.
*
* Implementation:
*   We use only a single 'Map' instance, set values in batch, and trigger the listeners
*   manually. The idea is to provide the normal 'Ref' API to the application, but keep
*   object creation to a minimum.
*/
function mapRef() {   // () => [Ref of Map of string -> any, (Array of [k,v]) => ()]

  const m = new Map();

  const ref = shallowRef(m);

  function setAll(kvs) {   // (Array of [k,v]) => ()
    kvs.forEach( ([k,v]) => {
      m.set(k,v);
    })
    triggerRef(ref);    // signal to subscribers that the value has changed
  }

  return [ref, setAll];
}

export {
  mapRef
}
