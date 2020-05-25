/*
* src/pages/Project/projectSub.js
*
* Subscription of a certain 'projectsC' document.
*/
const db = firebase.firestore();



//--- Project

// The same reactive table is for all projects
//
import {reactive, watchEffect} from "vue";

const project = reactive( new Map() );      // { ..projectC-doc }

function handleShot(ss) {   // one snapshot may have 1..n doc changes
  ss.docs.forEach(doc => {
    const id = doc.id;

    // Projects don't get directly deleted (unless someone does it manually); they get a '.removed' field added
    // to them (or removed, to resurrect).
    //
    const tmp = doc.exists ? convertDateFields(doc.data(), "created") : null;  // with optional '.removed'

    if (tmp && !('removed' in tmp)) {
      projects.set(id, tmp);
    } else {
      projects.delete(id);
    }
  })
}

// State from earlier user change
//
let unsub = null;  // () => () | null

const projectsC = db.collection('projects');

/*
* Watch the 'project' changes.
*/
watchEffect(() => {    // when the user changes

  // Firestore notes:
  //  - Need to start two watches - there is no 'or' compound query.
  //  - Cannot do a '.where()' on missing fields (Apr 2020) (we want projects without '.removed'). Can let them
  //    come and then skip.
  //
  //    This may be reason enough to place removed projects to a separate collection. #rework #data

  console.debug("User change seen in 'projects': ", user, user.value);

  if (user.value === null) {    // initial call (authentication unknown)

  } else if (user.value) {   // new user, start tracking
    assert(unsub === null);   // initial call never takes here

    const uid = user.value.uid;
    try {
      const a = projectsC.where('authors', 'array-contains', uid).onSnapshot(handleShot);
      const b = projectsC.where('collaborators', 'array-contains', uid).onSnapshot(handleShot);
      unsub = () => { a(); b() }
    } catch (err) {
      console.error("!!!", err);
      debugger;
    }

  } else {  // user signed out - wipe the projects and stop tracking!
    assert( user.value === false );

    // 'unsub' can be 'null' or non-null.
    projects.clear()
    if (unsub) unsub();
    unsub = null;
  }
});


// Snapshot of all the matching documents, when something changes. Update 'projects' accordingly.
//
const unsubscribeProject = watchProject( projectId, data => {   // (projectDoc | null) =>
  if (!data) {
    alert("Hey, we lost the project!!!");   // tbd. inform to Sentry

    $this.router.go(-1);    // tbd. how to do that with 4.x?
    return;
  }

  console.debug( `CHANGES TO PROJECT ${projectId}:`, data );

  /* not yet
  // If there's a new user, add tracking their name etc.
  //
  // Note: This may be "expensive" since each user starts to track N others, separately. Solution would be
  //    to shadow the current users (in a project) as a project field.
  //
  [...data.authors, ...data.collaborators].forEach( uid => {
    if (! (uid in userInfo)) {
      const unsub = watchUserInfo(uid, data => {
        console.debug( `CHANGES TO USER ${uid}:`, data );

        vm.userInfo[uid] = data;
      });

      vm._unsubs.push(unsub)
    }
  });
  */

  project.value = data;   // replace all fields; tbd. what is the optimal way for Vue.js to update things? (only some fields change)
});
