/*
* src/data/activeProjects.js
*
* Reactive Map of projects that a certain user has access to (and which are not removed).
*
* Used by:
*   - Home
*/
import { assert } from '/@/assert'
import { where } from 'firebase/firestore'

import { firestore as db } from '/@/firebase'

import { listenC } from '/@tools/listen'

// Firestore notes:
//  - Cannot do a '.where()' on missing fields (Apr 2020) (we want projects without '.removed'). Can let them
//    come and then skip.

function activeProjects(uid) {    // (string) => Ref of Map of <project-id> -> { ..projectsC doc }
  assert(uid instanceof String, _ => `Bad uid: ${uid}`);

  const [mapRef,unsub] = listenC( db, 'projects', where('members', 'array-contains', uid), {
    conv: (v) => v.removed ? null : v    // filter out removed already at the entrance
  });

  return [mapRef,unsub];
}

export {
  activeProjects
}
