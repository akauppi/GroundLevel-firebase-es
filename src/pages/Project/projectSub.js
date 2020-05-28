/*
* src/pages/Project/projectSub.js
*
* Follow a certain project. This feeds changes from Firestore to the UI.
*/
const db = firebase.firestore();

import {reactive} from "vue";
import {unshot} from '/src/firebase/utils.js'

function projectSub(id, uid) {   // (id: string, uid: string) => [ reactive( { ..projectC-doc } ), unsub: () => () ]

  const project = reactive( new Map() );   // reactive( { ..projectC-doc } )

  function handleDoc(doc) {
    const id = doc.id;

    console.debug(doc);
    debugger;

    // tbd. Shovel changes to 'project'
    const tmp = doc.exists ? convertDateFields(doc.data(), "created") : null;  // with optional '.removed'

    if (tmp && !('removed' in tmp)) {
      projects.set(id, tmp);
    } else {
      projects.delete(id);
    }
  }

  // Firestore notes:
  //  - Need to start two watches - there is no 'or' compound query.
  //  - Cannot do a '.where()' on missing fields (Apr 2020) (we want projects without '.removed'). Can let them
  //    come and then skip.
  //
  //    This may be reason enough to place removed projects to a separate collection. #rework #data

  let unsub;  // () => ()
  try {
    const a = projectsC.where('authors', 'array-contains', uid).onSnapshot(unshot(handleDoc));
    const b = projectsC.where('collaborators', 'array-contains', uid).onSnapshot(unshot(handleDoc));
    unsub = () => { a(); b() }
  } catch (err) {
    console.error("!!!", err);
    debugger;
  }

  // tbd. Is there a way in Javascript to bind to the 'delete' of an object. If so, we could do the 'unsub'
  //    when 'project' is deleted (and only return one thing). #js #advice
  //
  return [project, unsub];
}

export {
  projectSub
}
