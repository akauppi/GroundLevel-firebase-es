/*
* src/fb.js
*
* Application-specific abstractions over use of Firebase APIs.
*/
const db = firebase.firestore();

/*
* Mapping to Firebase collections.
* Note: Preparation for testability (not really beneficial at the moment).
*
* 'name': e.g. 'projects'
*/
function fbCollection(name) {   // (string) => collection-handle
  return db.collection(name);
}

export { fbCollection }