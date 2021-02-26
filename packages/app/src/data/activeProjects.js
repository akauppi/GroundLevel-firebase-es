/*
* src/data/activeProjects.js
*
* Reactive Map of projects that a certain user has access to (and which are not removed).
*
* Used by:
*   - Home
*/
import { assert } from '/@/assert'

import { firestore as db } from '/@/firebase'

import { computed } from 'vue'

import { listenC } from '/@tools/listenC'

// Firestore notes:
//  - Cannot do a '.where()' on missing fields (Apr 2020) (we want projects without '.removed'). Can let them
//    come and then skip.

function activeProjects(uid) {    // (string) => Ref of Map of <project-id> -> { ..projectsC doc }

  const [mapRef,unsub] = listenC( db, 'projects', ['members', 'array-contains', uid], {
    context: "listening to 'projectsC'",
    conv(v) {
      return v.removed ? null : v;    // filter out removed already at the entrance
    }
  });

  return [mapRef,unsub];
}

export {
  activeProjects
}
