/*
* src/rs/project.js
*
* Reactive tracking of a certain project.
*/
import { shallowReactive } from 'vue'

import { convertDateValue } from "../firebase/utils"

const db = firebase.firestore();

// Allow just one project to be subscribed, at a time. Safeguard against unnecessarily watching Firestore data.
//
let unsub;
if (unsub) {  // Happens because of Hot Module Reload, in development.

  // tbd. In development, WARN (and call 'unsub').
  //    In production, FAIL
  throw Error("Already subscribing to a project (did the code call '.unsub'?)")
}

/*
* Watch a certain project.
*
* Note:
*   Subcollections (visited, symbols) are subscribed separately. This is in line with how Firestore sees such collections:
*   while their paths can seem hierarchical, all collections are essentially "flat".
*
* Note:
*   JavaScript does not allow tapping to the garbage collection cycle of an object. This is why we need the explicit
*   'unsub' to be returned, to limit the number of database consumption a single client can create.
*/
function projectSub(id) {   // (id: string) => [shallowReactive of { title: string, ... }, unsub: () => ()]
  const projectD = db.doc(`projects/${id}`);

  const project = shallowReactive();

  function handleSnapshot(ss) {
    const d = ss.exists ? ss.data() : null;
    if (d && !d.removed) {
      console.debug(`Reading project '${id}':`, d);

      // Side note:
      //    It's kind of cool that we enforce the data schema here. Means application code does not need to go all the
      //    way to DATA.md and we might use types, at some point.
      //
      //    Also, we want to change date fields to JavaScript native presentation, and this allows a good place.

      Object.assign( project, {
        title: d.title,
        created: convertDateValue(d.created),
        authors: d.authors,
        collaborators: d.collaborators
      });

    } else {
      console.warning("Project was removed while we're working on it.");
      Object.assign( project, {} );
    }
  }

  // Note: using the observer '{next:, error:, ...}' prototype. Without it, WebStorm IDE picks the wrong one.
  //
  const innerUnsub = projectD.onSnapshot({
    next: handleSnapshot,
    error: err => { console.error("Error in subscription to project:", err); }
  });

  unsub = () => {
    innerUnsub();
    unsub = null;
  }

  return [project, unsub];
}

export {
  projectSub
}
