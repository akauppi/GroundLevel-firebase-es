/*
* src/data/memberUserInfos_notMe.js
*
* Provide UI information about the members (may contain also former members) of a project.
*
* For membership of the project, use the '.members' of the project data itself (not us). This provides auxiliary
* information about the (other) users, for showing on the UI (name, picture, indication of last activity).
*
* Used by:
*   - Home > ProjectTile
*   - Project page
*/
import { assert } from '/@/assert'

import firebase from 'firebase/app'
import '@firebase/firestore'
assert(firebase?.firestore);

assert(firebase.apps.length > 0, "Default Firebase app NOT initialized?!");   // DEBUG

const db = firebase.firestore();
const FieldPath = firebase.firestore.FieldPath

/*
* Note: Excluding the current user is simply an optimization (because of billing).
*/
function projectUserInfoC_notMe(projectId, myUid) {
  assert(projectId);

  return db.collection(`projects/${projectId}/userInfo`)
    .where(FieldPath.documentId(), '!=', myUid);
}

function memberUserInfos_notMe(projectId) {    // (string) => RMap of <uid> -> { ...projectUserInfoC doc, status: "live"|"recent"|"" }
  assert(projectId);

  /*
  * Convert the data a bit:
  *   - instead of passing the '.lastActive' date field (which is imprecise by design), turn it into a status that
  *     better describes the recency. This UI centric transform is made rather low in the data pipeline. We'll see.
  *   - compatibility changes (old data has '.name' and we're lazy to change it..)
  */
  function conv(o) {    // (obj) => obj
    const diffMins = (new Date() - o.lastActive) / (1000 * 60);

    const state = (diffMins < 10) ? 'live' :
      (diffMins < 24*60) ? 'recent' :
      '';

    return {
      ...o,
      displayName: o.displayName || o.name,   // should eventually change in data for '.displayName'. #later
      state,
      name: undefined,         // hide
      lastActive: undefined    // hide
    }
  }

  const uid = firebase.auth().currentUser.uid;

  const rm = projectUserInfoC_notMe(projectId, uid)
    .xListen( { context: "listening to project userInfo", conv } );

  return rm;
}

export {
  memberUserInfos_notMe
}
