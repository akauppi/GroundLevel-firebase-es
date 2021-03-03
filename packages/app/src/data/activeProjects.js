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

import { db } from '/@firebase'

import { listenC } from '/@tools/listen'

function activeProjects(uid) {    // (string) => Ref of Map of <project-id> -> { ..projectsC doc }

  // Firestore does not allow '.where()' on missing fields (Mar 2021); we want projects without '.removed'.
  // Let them come and skip the ones not wanted.
  //
  const [mapRef,unsub] = listenC( db, 'projects', where('members', 'array-contains', uid), {
    conv: (v) => v.removed ? null : v    // filter out removed already at the porch
  });

  return [mapRef,unsub];
}

export {
  activeProjects
}
