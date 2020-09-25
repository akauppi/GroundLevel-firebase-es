/*
* src/rves/projects.js
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
// Used by: 'Home' for populating the grid of projects
//
// Projects marked 'removed' are not included.
//
const projects = shallowReactive( new Map() );
  //
  // { <project-id>: {
  //    title: string,
  //    created: Date,
  //    lastVisited: Date,
  //    authors: Array of uid (>=1),
  //    members: Array of uid (>=1),
  //
  //    userInfo: {                     // <-- subscribed separately; will update separate from main body
  //      <user-id>: { photoURL: string }
  //    }
  // }}

const unsubs = new Set;    // [ () => (), ... ]

function userInfoC(projectId) {
  return db.collection('projects')
    //.where('members', 'array-contains', uid)    // tbd. is it needed?
    .doc(projectId)
    .collection("userInfo");
}

/*
* Set fields of 'o' to 'projects[id]', without disturbing other fields, if there are any.
*/
function projectMerge(id, o) {
  projects.set(id,{ ...(projects.get(id) || {}), ...o });
}

function handleDoc(doc) {
  const id = doc.id;

  // Projects don't get directly deleted (unless someone does it manually); they get a '.removed' field added
  // to them (or removed, to resurrect).
  //
  const raw = doc.exists ? doc.data() : null;  // with optional '.removed'

  console.debug("Got:", raw);

  const newProject = raw && !('removed' in raw) && !projects.has(id);

  if (raw && !('removed' in raw)) {
    const o = {
      title: raw.title,
      created: convertDateValue(raw.created),
      //lastVisited: null,    // not there, yet
      authors: raw.authors,
      members: raw.members ?? [...raw.authors, ...raw.collaborators]    // legacy support for when 'raw.members' didn't exist (sample; '.collaborators' is no more)
    };
    //REMOVE projects.set(id, { ...o, userInfo: projects.get(id)?.userInfo });
    projectMerge(id, o);

  } else {

    // tbd. Unsubscribing 'userInfo' updates on project delete should be handled. Note: it MIGHT be easiest to just
    //    have 'userInfo' as fields within the document?
    //
    projects.delete(id);
  }

  if (newProject) {    // new project, start tracking also its userInfo
    function handleDoc2(doc) {
      const userId = doc.id;

      const raw = doc.exists ? doc.data() : null;

      console.debug("Got userInfo:", raw);

      if (raw) {
        const o = {
          photoURL: raw.photoURL,
          //name: raw.name
        };

        const tmp = { ...(projects.get(id)?.userInfo || {}), [userId]: o };

        projectMerge(id, { userInfo: tmp });
      }
    }

    //--- Changes to 'projects/{id}/userInfoC'
    try {
      const tmp = userInfoC(id).onSnapshot( unshot(handleDoc2) );
      unsubs.add(tmp);
    } catch (ex) {
      central.fatal("Subscribing to 'userInfoC' failed:", ex);    // never observed
      throw ex;
    }

    console.debug(`UserInfo for ${id} subscribed.`);
  }
}

function projectsC(uid) {
  return db.collection('projects')
    .where('members', 'array-contains', uid);
}

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
    assert(unsubs.size === 0);   // always transitions between users with logged out state in between

    const uid = auth.uid;

    //--- Changes to 'projects/{id}'
    try {
      const tmp = projectsC(uid).onSnapshot( unshot(handleDoc) );
      unsubs.add(tmp);
    } catch (ex) {
      central.fatal("Subscribing to 'userInfoC' failed:", ex);
      throw ex;
    }

  } else if (auth === false) {  // user signed out - wipe the projects and stop tracking!
    projects.clear();

    unsubs.forEach( unsub => unsub() );
    unsubs.clear();

  } else {
    assert(auth === undefined);   // initial call (ignore)
  }
});

export {
  projects
}
