/*
* src/refs/project.js
*
* Follow a certain project. This feeds changes from Firestore to the UI.
*/
import { ref } from "vue";
import { convertDateValue } from "../firebase/utils"

const db = firebase.firestore();

// Control that only one active subscription, at a time
let activeSubscription = false;

/*
* Watch a certain project.
*
* Note:
*   Subcollections (visited, symbols) are subscribed separately. This is in line with how Firestore sees such collections:
*   while their paths can seem hierarchical, all collections are essentially "flat".
*
* Note:
*   JavaScript does not seem to allow tapping to the garbage collection cycle of an object. This is why we need the
*   explicit 'unsub' to be returned, to limit the number of database consumption a single client can create.
*/
function projectSub(id) {   // (id: string) => ref( undefined | { title: string, ... } | null ) with { unsub: () => () }
  const projectD = db.doc(`projects/${id}`);

  if (activeSubscription) {
    throw Error("Already subscribing to a project (did the code call '.unsub'?)")
  }
  activeSubscription = true;

  // Would prefer to expose 'project' only after it has its first value. For this reason, using a 'ref' might be
  // better (undefined -> { ... } -> null if project is closed). We cannot do that with 'reactive'.

  /*** WHAT IF: ref ***/
  // Note: We don't need deep reactivity - just the top level
  const project = ref();
    // undefined | { title: string, created: date, removed?: date, authors: Array of uid (>=1), collaborators: array of uid (>=0) }

  /*** WHAT IF: reactive
  const project = reactive({});
  ***/

  function handleSnapshot(ss) {
    const d = ss.exists ? ss.data() : null;
    if (d && !d.removed) {
      console.debug("Setting 'project' to:", d);

      // Side note:
      //    It's kind of cool that we enforce the data schema here. Means application code does not need to go all the
      //    way to DATA.md and we might use types, at some point.
      //
      //    Also, we want to change date fields to JavaScript native presentation, and this allows a good place.

      //WHAT IF: ref
      project.value = {
        title: d.title,
        created: convertDateValue(d.created),
        authors: d.authors,
        collaborators: d.collaborators
      };   // Q: how efficient is this for non-changing fields (mostly just one changes, at a time)? #vueJs #performance

      /***WHAT IF: reactive
      project.set({   // not sure if there even is .set
        title: d.title,
        created: new Date(d.created),
        authors: d.authors,
        collaborators: d.collaborators
      });
      ***/

    } else {
      console.warning("Project was removed while we're working on it.");
      //project.clear();

      project.value = null;
    }
  }

  // Note: using the observer '{}' prototype. Without it, WebStorm IDE picks the wrong one and hints 'onError' as 'onNext'.
  //
  const unsubInner = projectD.onSnapshot({
    next: handleSnapshot,
    error: err => { console.error("Error in subscription to project:", err); }
  });

  // 'ref.value' is initially 'undefined', until we get the first snapshot
  return [project, () => {
    assert(activeSubscription);
    activeSubscription = false;
    unsubInner();
  }];
}

export {
  projectSub
}
