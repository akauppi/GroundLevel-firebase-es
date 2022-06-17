/*
* src/data/wr/shareMyActivity.js
*
* Write the projectUserInfoC '.lastActive' field, but only if enough time has passed from last write.
*
* This gets called by opening a project, and in certain activities within there.
*/
import { setDoc } from '@firebase/firestore'

import { getCurrentUserId_sync } from "/@/user"
import { dbDoc } from "/@firebase/firestore"
import { serverTimestampSentinel } from "/@firebase/firestore-sentinel-exp"

let lastActive;   // Date | undefined; when last written
let lastUid;      // ..for this user

function projectsUserInfoD(projectId, uid) {
  return dbDoc( `projects/${projectId}/userInfo`, uid );
}

function shareMyActivity(projectId) {
  const longEnoughSecs = 5 * 60;   // 5 min; tbd. take from config?
  const uid = getCurrentUserId_sync();

  function longEnough() {
    if (!lastActive) return true;

    const diffMs = new Date() - lastActive;
    return (diffMs / 1000) >= longEnoughSecs;
  }

  if (uid !== lastUid || longEnough()) {
    const prom = setDoc(
      projectsUserInfoD(projectId, uid),
      { lastActive: serverTimestampSentinel },
      { merge: true }   // options
    );

    // Let the tail run freely
    prom.then( _ => {
      lastActive = new Date();
      lastUid = uid;

      console.debug("Activity posted", { uid, lastActive });
    })
    .catch( err => {
      //tbd. central.error("Reporting activity failed:", err);
    });
  }
}

export {
  shareMyActivity
}
