/*
* src/data/activeProjects.js
*
* Reactive Map of projects that a certain user has access to (and which are not removed).
*
* Used by:
*   - Home
*/
import { collRef, where } from './firestore/listen.ref'

function activeProjects(uid) {    // (string) => Ref of Map of <project-id> -> { ..projectsC doc }

  // Firestore does not allow '.where()' on missing fields (Mar 2021); we want projects without '.removed'.
  // Let them come and skip the ones not wanted.
  //
  const [mapRef,unsub] = collRef( 'projects/', where('members', 'array-contains', uid), {
    conv: (v) => v.removed ? null : v    // filter out removed already at the porch
  });

  return [mapRef,unsub];
}

export {
  activeProjects
}
