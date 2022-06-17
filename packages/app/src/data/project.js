/*
* src/data/project.js
*
* Follow a certain project.
*
* Used by:
*   - Project page
*/
import { db } from '/@firebase/firestore'
import { docRef } from '/@tools/listen.ref'
import { doc, collection } from '@firebase/firestore'

function projectPair(projectId) {    // (string) => [Ref of { ..projectsC doc }, () => ()]
  const projectD = doc( collection(db, 'projects/'), projectId);
  return docRef( projectD );
}

export {
  projectPair
}
