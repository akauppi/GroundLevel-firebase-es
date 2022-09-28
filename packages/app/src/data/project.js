/*
* src/data/project.js
*
* Follow a certain project.
*
* Used by:
*   - Project page
*/
import { docRef } from './firestore/listen.ref'

function projectPair(projectId) {    // (string) => [Ref of { ..projectsC doc }, () => ()]
  return docRef( 'projects/', projectId );
}

export {
  projectPair
}
