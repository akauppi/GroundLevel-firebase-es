/*
* src/refs/projects.js
*
* Reactive 'projects' map, reflecting both database and sign-in/out changes.
*/
const db = firebase.firestore();

import { reactive, watchEffect } from 'vue';
import { user } from '../refs/user.js';
import { convertDateFields, unshot } from "../firebase/utils";

// The same reactive table is for all users. We just wipe it like a restaurant table. 🍽
//
// Used by: 'Home.vue' for populating the grid of projects
//
// Projects marked 'removed' are not included.
//
const projects = reactive( new Map() );      // <project-id>: { title: string, created: datetime, lastVisited: datetime }

function handleDoc(doc) {
  const id = doc.id;

  // Projects don't get directly deleted (unless someone does it manually); they get a '.removed' field added
  // to them (or removed, to resurrect).
  //
  const tmp = doc.exists ? convertDateFields(doc.data(), "created") : null;  // with optional '.removed'

  if (tmp && !('removed' in tmp)) {
    projects.set(id, tmp);
  } else {
    projects.delete(id);
  }
}

// State from earlier user change
//
let unsub = null;  // () => () | null

const projectsC = db.collection('projects');

/*
* Watch the 'user' changes.
*/
watchEffect(() => {    // when the user changes

  // Firestore notes:
  //  - Need to start two watches - there is no 'or' compound query.
  //  - Cannot do a '.where()' on missing fields (Apr 2020) (we want projects without '.removed'). Can let them
  //    come and then skip.
  //
  //    This may be reason enough to place removed projects to a separate collection. #rework #data

  console.debug("User change seen in 'projects': ", user, user.value);

  if (user.value === null) {    // initial call (authentication unknown)

  } else if (user.value) {   // new user, start tracking
    assert(unsub === null);   // initial call never takes here

    const uid = user.value.uid;
    try {
      const a = projectsC.where('authors', 'array-contains', uid).onSnapshot(unshot(handleDoc));
      const b = projectsC.where('collaborators', 'array-contains', uid).onSnapshot(unshot(handleDoc));
      unsub = () => { a(); b() }
    } catch (err) {
      console.error("!!!", err);
      debugger;
    }

  } else {  // user signed out - wipe the projects and stop tracking!
    assert( user.value === false );

    // 'unsub' can be 'null' or non-null.
    projects.clear()
    if (unsub) unsub();
    unsub = null;
  }
});

export {
  projects
}
