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
import { assert } from '/@tools/assert'

import { collection, where } from '@firebase/firestore'

import { getCurrentUserId_sync } from "/@/user"
import { collRef } from "/@tools/listen.ref"
import { db } from '/@firebase/firestore'
import { documentIdSentinel } from '/@firebase/firestore-sentinel-exp'

function memberUserInfos_notMe(projectId) {    // (string) => [Ref of Map of <uid> -> { ...projectUserInfoC doc, status: "live"|"recent"|"" }, () => ()]
  assert(projectId);

  const myUid = getCurrentUserId_sync();

  /*
  * Convert the data a bit:
  *   - instead of passing the '.lastActive' date field (which is imprecise by design), turn it into a status that
  *     better describes the recency. This UI centric transform is made rather low in the data pipeline. We'll see.
  *   - compatibility changes (old data has '.name' and we're lazy to change it..)
  *
  * Note: The benefit of doing this within 'listenQ' is that the conversion is only applied to incoming (changed) data.
  *     If we used 'computed()' and a raw ref of map, all values would need to be iterated, for every change.
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

  const [ref, unsub] = collRef( collection(db, `projects/${projectId}/userInfo/`), where(documentIdSentinel, '!=', myUid), {
    conv
  } );

  return [ref,unsub];
}

export {
  memberUserInfos_notMe
}
