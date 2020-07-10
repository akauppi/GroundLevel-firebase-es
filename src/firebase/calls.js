/*
* src/firebase/calls.js
*
* Calls we can do to cloud functions.
*/

/*
* Get UI information about a certain other user (that we work together with in a given project).
*
* This is an internal function. The exposed one uses caching, to reduce the number of calls (to see updated user
* information, the user can do a refresh).
*/
async function userUIinfo(projectId, uid) {    // (string, string) => Promise of { ..userInfoC-fields }

  //NOT IMPLEMENTED! tbd.

  return { name: "jolly", photoURL: "" }  // PLACEHOLDER
}

/*
*
*/
const cachedUsers = new Map();    // { <uid>: { ..userInfoC-fields }
// TEMP
cachedUsers.set("7wo7MczY0mStZXHQIKnKMuh1V3Y2", { name: "akauppi", photoURL: "https://lh3.googleusercontent.com/ogw/ADGmqu8vMTkVAan5BUz-8ALj1TF4LL71U4AGXSgKmk8=s64-c-mo" };

async function userUIinfoCached(projectId, uid) {
  if (cachedUsers.has(uid)) {
    return cachedUsers[uid];
  } else {
    const o = await userUIinfo(projectId, uid);
    cachedUsers.set(uid, o);
    return o;
  }
}

export {
  userUIinfoCached
}

