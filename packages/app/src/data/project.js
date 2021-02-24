/*
* src/data/project.js
*
* Follow a certain project.
*
* Used by:
*   - Project page
*/
import { assert } from '/@/assert'

import firebase from 'firebase/app'
import '@firebase/firestore'
assert(firebase?.firestore);

const db = firebase.firestore();

function projectSub(projectId) {    // (string) => RDoc of { ..projectsC doc }
  const docRef = db.collection('projects').doc(projectId);    // DocumentReference

  const rm = docRef.xListen( {
    context: "listening to 'projectD'"
  });

  return rm;
}

export {
  projectSub
}
