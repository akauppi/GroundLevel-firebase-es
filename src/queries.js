/*
* src/queries.js
*
* These are the use cases we have against the Firestore data. Having them in one place helps in modeling of the data
* (i.e. use cases first, security rules alongside it -> leads to modeling -> test and observe behaviour and costs).
*/
import { fbCollection } from '@/fb';

const projectsC = fbCollection('projects');

import { onSignOut } from "@/util/auth";

/*
* Watch the projects the current user has access to.
*
* Used by: populating the grid of projects
*
* Cleanup is handled automatically (the function just don't get called any more after sign-out).
*/
function watchMyProjects(f) {    // ((doc) => ()) => ()
  const uid = firebase.auth().currentUser.uid;    // should be signed in, i.e. '.currentUser' is non-null

  // Need to start two watches - there is no 'or' compound query.

  let unsub1, unsub2;
  try {
    unsub1 = projectsC.where( 'authors', 'array-contains', uid )
        .onSnapshot(f);
  }
  catch (err) {
    debugger;
    log.error("!!!", err.msg)
  }

  unsub2 = projectsC.where( 'collaborators', 'array-contains', uid )
      .onSnapshot(f);

  onSignOut(unsub1, unsub2);
}

export {
  watchMyProjects
}