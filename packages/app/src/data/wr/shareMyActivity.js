/*
* src/data/wr/shareMyActivity.js
*
* Write the projectUserInfoC '.lastActive' field, but only if enough time has passed from last write.
*
* This gets called by opening a project, and in certain activities within there.
*/
import { assert } from '/@/assert'

import { setDoc } from 'firebase/firestore'

import { getCurrentUserWarm } from "/@/user"
import { currentUser } from "/@firebase"
import { serverTimestampSentinel } from "/@firebase/sentinel"

import { dbD } from '../common'

let lastActive;   // Date | undefined; when last written
let lastUid;      // ..for this user

function projectsUserInfoD(projectId, uid) {
  return dbD(`projects/${projectId}/userInfo/${uid}`);
}

function shareMyActivity(projectId) {
  const longEnoughSecs = 5 * 60;   // 5 min; tbd. take from config?
  const uid = getCurrentUserWarm().uid;

  console.debug(`!!! Firebase sees: ${ currentUser }`, { uid }); // DEBUG

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
    })
    .catch( err => {
      central.error("Reporting activity failed:", err);
    });
  }
}

export {
  shareMyActivity
}
