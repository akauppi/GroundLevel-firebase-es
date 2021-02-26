/*
* src/data-wr/shareMyActivity.js
*
* Write the projectUserInfoC '.lastActive' field, but only if enough time has passed from last write.
*
* This gets called by opening a project, and in certain activities within there.
*/
import { assert } from '/@/assert'

import { FieldValue, setDoc } from 'firebase/firestore'
import { userRef2, getCurrentUserWarm } from "/@/user"

import { dbD } from '../data/common'

import { watchEffect } from 'vue'

let lastActive;   // Date | undefined; when last written

/*unsub=*/ watchEffect( () => {
  if (userRef2.value === null) {
    lastActive = undefined;   // user signed out
  }
});

function projectsUserInfoD(projectId, uid) {
  return dbD(`projects/${projectId}/userInfo/${uid}`);
}

function shareMyActivity(projectId) {
  const longEnoughSecs = 5 * 60;   // 5 min; tbd. take from config?
  const uid = getCurrentUserWarm().uid;

  function longEnough() {
    const diffMs = new Date() - lastActive;
    return (diffMs / 1000) >= longEnoughSecs;
  }

  if (!lastActive || longEnough()) {
    const prom = setDoc(
      projectsUserInfoD(projectId, uid),
      { lastActive: FieldValue.serverTimestamp() },
      { merge: true }   // options
    );

    // Let the tail run freely, but report errors if fails.
    prom.catch( err => {
      central.error("Reporting activity failed:", err);
    });
  }
}

export {
  shareMyActivity
}
