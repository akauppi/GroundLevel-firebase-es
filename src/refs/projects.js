/*
* src/refs/projects.js
*
* Reactive 'projects' map, reflecting both database and sign-in/out changes.
*/
assert(firebase.firestore);

const db = firebase.firestore();

import { shallowReactive, watchEffect } from 'vue'
import { authRef } from '../firebase/authRef'
import { convertDateValue, unshot } from "../firebase/utils"

// The same reactive table is for all logins. We just wipe it like a restaurant table. 🍽
//
// Used by: 'Home.vue' for populating the grid of projects
//
// Projects marked 'removed' are not included.
//
const projects = shallowReactive( new Map() );
  //
  // { <project-id>: { title: string, created: Date, lastVisited: Date, authors: Array of uid (>=1), members: Array of uid (>=1) }

function handleDoc(doc) {
  const id = doc.id;

  // Projects don't get directly deleted (unless someone does it manually); they get a '.removed' field added
  // to them (or removed, to resurrect).
  //
  const raw = doc.exists ? doc.data() : null;  // with optional '.removed'

  console.debug("Got:", raw);

  if (raw && !('removed' in raw)) {
    const o = {
      title: raw.title,
      created: convertDateValue(raw.created),
      //lastVisited: null,    // not there, yet
      authors: raw.authors,
      members: raw.members ?? [...raw.authors, ...raw.collaborators]    // prepared for either data model
    };
    projects.set(id, o);
  } else {
    projects.delete(id);
  }
}

// State from earlier user change
//
let unsub;    // undefined | () => () | null

const projectsC = db.collection('projects');

watchEffect(() => {    // when the user changes
  const auth = authRef.value;

  // Firestore notes:
  //  - Need to start two watches - there is no 'or' compound query.
  //  - Cannot do a '.where()' on missing fields (Apr 2020) (we want projects without '.removed'). Can let them
  //    come and then skip.
  //
  //    This may be reason enough to place removed projects to a separate collection. #rework #data

  console.debug("User change seen in 'projects':", auth);

  if (auth) {   // new user, start tracking
    assert(!unsub);   // always transitions between users with logged out state in between

    const uid = auth.uid;
    try {
      unsub = projectsC.where('members', 'array-contains', uid).onSnapshot( unshot(handleDoc) );
    } catch (ex) {
      // Toast?
      logs.fatal("Subscribing to 'projectsC' failed:", ex);    // never observed
    }

  } else if (auth === false) {  // user signed out - wipe the projects and stop tracking!
    // 'unsub' can be 'null' or non-null.
    projects.clear()
    if (unsub) {
      unsub(); unsub= null;
    }

  } else {
    assert(auth === undefined);   // initial call (ignore)
  }
});

export {
  projects
}
