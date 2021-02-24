/*
* src/data-wr/shareMyActivity.js
*
* Write the projectUserInfoC '.lastActive' field, but only if enough time has passed from last write.
*
* This gets called by opening a project, and in certain activities within there.
*/
import { assert } from '/@/assert'

import firebase from 'firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
assert(firebase?.auth && firebase?.firestore);

const db = firebase.firestore();
const FieldValue = firebase.firestore.FieldValue;

let lastActive;   // Date | undefined; when last written

firebase.auth().onAuthStateChanged( (o) => {
  if (o === null) {
    lastActive = undefined;
  }
});

function projectsUserInfoC(projectId) {
  return db.collection(`projects/${projectId}/userInfo`);
}

function shareMyActivity(projectId) {
  const longEnoughSecs = 5 * 60;   // 5 min; tbd. take from config?
  const uid = firebase.auth().currentUser.uid;

  function longEnough() {
    const diffMs = new Date() - lastActive;
    return (diffMs / 1000) >= longEnoughSecs;
  }

  if (!lastActive || longEnough()) {
    const prom = projectsUserInfoC(projectId)
      .doc(uid).set( { lastActive: FieldValue.serverTimestamp() }, { merge: true });

    // Let the tail run freely, but report errors if fails.
    prom.catch( err => {
      central.error("Reporting activity failed:", err);
    });
  }
}

export {
  shareMyActivity
}
