/*
* src/firebase/calls.js
*
* Calls we can do to cloud functions.
*/

/*
* Get UI information about a certain other user (that we work together with in a given project).
*
* Note: The caller should do some caching, to restrict the number of calls.
*
* tbd. replace eventually with a function that brings info of all current users in the project (suits use case best
*     and again reduces the number of calls).
*/
async function userUIinfoPromFAKE(projectId, uid) {    // (string, string) => Promise of { ..userInfoC-fields }

  //NOT IMPLEMENTED! tbd.

  const o = (uid == "7wo7MczY0mStZXHQIKnKMuh1V3Y2") ? { name: "akauppi", photoURL: "https://lh3.googleusercontent.com/ogw/ADGmqu8vMTkVAan5BUz-8ALj1TF4LL71U4AGXSgKmk8=s64-c-mo" }
    : { name: "jolly", photoURL: "" };  // PLACEHOLDER
  return Promise.resolve(o);
}

export {
  userUIinfoPromFAKE as userUIinfoProm
}
