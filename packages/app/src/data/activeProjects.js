/*
* src/data/activeProjects.js
*
* Reactive Map of projects that a certain user has access to (and which are not removed).
*
* Used by:
*   - Home
*/
import { assert } from '/@/assert'

import firebase from 'firebase/app'
import '@firebase/firestore'
assert(firebase?.firestore);

const db = firebase.firestore();

// Firestore notes:
//  - Cannot do a '.where()' on missing fields (Apr 2020) (we want projects without '.removed'). Can let them
//    come and then skip.
//
// Note: Being a collaborator (not member), even skipping may be problematic. Let's see. (tbd. test and remove the comment)
//
function projectsC(uid) {   // (string) -> Query
  return db.collection('projects')
    .where('members', 'array-contains', uid);
}

function activeProjects(uid) {    // (string) => RMap of <project-id> -> { ..projectsC doc }

  const rm = projectsC(uid)
    .xListen( {
      context: "listening to 'projectsC'",
      filter: o => !o.removed
    });

  return rm;
}

export {
  activeProjects
}
