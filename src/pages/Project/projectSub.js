/*
* src/pages/Project/projectSub.js
*
* Follow a certain project. This feeds changes from Firestore to the UI.
*/
const db = firebase.firestore();
import {ref} from "vue";
import {convertDateFields, unshot} from '/src/firebase/utils.js';

const projectsC = db.collection("projects");

// tbd. Should we use 'ref' or 'reactive'??? STUDY.

/*
* Watch a certain project (as a 'ref').
*
* The user is expected to be logged in.
*
* tbd. Can we do clean when the 'ref' would be GC'ed? That way, there may not be a need for explicit unsubscribe
*     by the caller. #study #vue3
*/
function projectSub(id) {   // (id: string) => [ reactive( { ..projectC-doc } ), unsub: () => () ]

  const project = ref(null);  // 'null until intialized - can we tell Vue3 when it is, or make 'Promise of ref'? tbd.

  function handleDoc(doc) {
    const tmp = doc.exists ? doc.data() : null;  // with optional '.removed'

    if (tmp && !('removed' in tmp)) {
      project.value = tmp;    // how does it handle non-changing fields (mostly just one would change)
    } else {
      console.warning("Project was removed while we're working on it.");
      project.value = null;
    }
  }

  let unsub;  // () => ()
  try {
    unsub = projectsC.doc(id).onSnapshot(unshot(handleDoc));
  } catch (err) {
    console.error("!!!", err);
    debugger;
  }

  // tbd. can we bind to '.delete' of project??
  return [project, unsub];
}

export {
  projectSub
}
