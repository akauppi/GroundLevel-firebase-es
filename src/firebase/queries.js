/*
* src/firebase/queries.js
*
* These are the use cases we have against the Firestore data. Having them in one place helps in modeling of the data
* (i.e. use cases first, security rules alongside it -> leads to modeling -> test and observe behaviour and costs).
*/
const db = firebase.firestore();

// Tokens that Firestore uses:
const FieldValue = firebase.firestore.FieldValue;
const serverTimestamp = FieldValue.serverTimestamp();

const projectsC = db.collection('projects');
const invitesC = db.collection('invites');
const userInfoC = db.collection('userInfo');

import { assert } from "/@/util/assert";

function informGen(f) {   // ((string, {...}) => ()) => ((QuerySnapshot) => ())
  return function inform(snapshot) {
    snapshot.docs.forEach(doc => {
      const id = doc.id;
      const data = doc.exists ? convertDateFields( doc.data(), "created" ) : null;

      f(id, data);
    })
  };
}

/*
* Firestore client provides timestamps as '{ seconds: integer, nanos: 0 }'. Let's convert those to JavaScript 'Date'.
*/
function convertDateFields( obj, ...fields ) {
  const o2 = {};   // collect date fields here

  fields.forEach( (key) => {
    assert( !(obj[key] instanceof Date) );    // Make sure Firestore does not provide as a 'Date'
    assert( typeof obj[key].seconds == 'number' );

    const epochSecs = obj[key].seconds;     // sub-second resolution could be reached from '.nanoseconds' (but we don't need it)

    o2[key] = new Date(epochSecs*1000);
  });

  return { ...obj, ...o2 }    // merge the objects
}

/*
* Watch the projects the current user has access to and has visited.
*
* Used by: populating the grid of projects
*
* The caller is expected to call the returned (unsubscribe) function, once watching is no longer needed.
*/
function watchMyProjects(f) {    // (/*id*/ string, { title: string, created: datetime, lastVisited: datetime }) => ()) => (() => ())
  const uid = firebase.auth().currentUser.uid;    // should be signed in, i.e. '.currentUser' is non-null

  const inform = informGen(f);

  // Need to start two watches - there is no 'or' compound query.

  let unsub1, unsub2;   // tbd. must be cooler way? #js #help
  try {
    unsub1 = projectsC.where( 'authors', 'array-contains', uid )
      .onSnapshot(inform);
    unsub2 = projectsC.where( 'collaborators', 'array-contains', uid )
      .onSnapshot(inform);
  }
  catch (err) {
    debugger;
    console.error("!!!", err.msg)
  }

  return () => {
    unsub1();
    ubsub2();
  }
}

/*
* Remove a project (needs to be an author)
*
* Note: Just an individual author can remove a project. Any better ideas..?
*   - Could require all authors to remove, or to reduce the number of authors first to 1 - then allow that person to
*     remove.  (revisit once it's a problem)
*/
function removeProject(projID) {    // (string) -> Promise of ()

  const prom = projectsC.doc(projID).update({
    removed: serverTimestamp
  });
  return prom;
}

/*
* Create a project (anyone can do this, becoming its author)
*/
function createProject(title) {   // (string) => Promise of ()
  const user = firebase.auth().currentUser;

  const prom = projectsC.doc().set({
    title: title,
    created: serverTimestamp,

    authors: [user],
    collaborators: []
  });

  // Note: Sub-collections will get automatically created, on use.

  return prom;
}

/*
* Promote an existing collaborator to author.
*/
function promoteToAuthor(projID, uid) {
  const user = firebase.auth().currentUser;

  const prom = projectsC.doc(projID).update({
    authors: FieldValue.arrayUnion(uid),
    collaborators: FieldValue.arrayRemove(uid)
  });
  return prom;
}

/*
* Remove an author
*/
//...


//--- Visits ---

/*
* Mark a visit
*/
function markVisit(projID) {
  const user = firebase.auth().currentUser;

  return projectsC.doc(projID).collection('visited').doc(user).update({
    at: serverTimestamp
  });
}


//--- Symbols ---

/*
* Symbol object:
* {
*   layer: int,
*   shape: "star",
*   size: int,
*   fillColor: string,    // CSS color string
*   center: { x: num, y: num }
* }
*/

/*
* Create a symbol, keep it claimed for edits
*/
function createSym(projID, o) {
  const user = firebase.auth().currentUser;

  return projectsC.doc(projID).collection('symbols').doc().set({
    "_": o,
    "claimed": { by: user, at: serverTimestamp }
  });
}

/*
* Release all claims
*
* Note: It is an alternative to let the caller provide the symbol id's that shall be released. It would know this
*     information. The benefit would be less Firestore operations: just the writes. Now we also get billed for the
*     reads resulting from the query.
*
* We can safely separate the query and the writing from each other, because as long as we the user holds a claim to
* the symbols, no-one else will be changing them. Also, we expect the current user not to add more claims while this
* is running (it won't really harm; those just won't get deleted; normal distributed timing things.. never mind).
*/
function releaseAllClaims(projID) {   // (string) => Promise of ()
  const user = firebase.auth().currentUser;

  const symbolsC = projectsC.doc(projID).collection('symbols');

  const prom= symbolsC
    .where("claimed.by", "==", user)
    .get()
    .then( (snapshot) => {
        const symbolIds = snapshot.docs.map( doc => doc.id );
        console.debug("Going to be releasing claim on symbols:", symbolIds);

        // tbd. If this is more than some treshold, we should run multiple batches

        const batch = db.batch();

        symbolIds.forEach( id => {
          batch.set( symbolsC.doc(id), { claimed: FieldValue.delete() } );
        });
        return batch.commit();
    });
}


//--- Invites ---

/*
* Watch the projects the current user has been invited to.
*
* An invite is simply an email - such a person might not even have a Firebase user-id, until they sign in the first
* time. Thus, this watch applies to the 2nd..nth invite, allowing them to be listed in the UI.
*
* Used by: populating the grid of projects
*
* The caller is expected to call the returned (unsubscribe) function, once watching is no longer needed.
*
* Returns:
*   - An unsubscribe function if the subscription was successful.
*
* Throws:
*   - false if the user has not confirmed their email address (UI can ignore this; or remind the user to do so in order to
*     see invites also in the UI)
*   - if subscribing failed (reason in the message)
*/
function watchMyInvites(f) {    // (/*id*/ string, { project: project-id, by: uid, at: timestamp }) => ()) => (() => ())
  const user = firebase.auth().currentUser;    // should be signed in, i.e. '.currentUser' is non-null
  assert(user);

  if (!user.emailConfirmed) {
    // tbd. Candidate for server-side logging.  (how do we do that, in Firebase?)

    throw "User has not confirmed their stated email. Won't show the invites.";   // then again... since the first invite worked, we know they are the right one?
  }
  const email = user.email;

  const unsub = (() => {    // wrapped to allow 'try' to provide a value. Is there a better way in JS? #help
    try {
      return invitesC.where('invitedEmail', '==', email)
          .onSnapshot(informGen(f));
    } catch (err) {
      throw `Unable to subscribe to invites: ${err.msg}`;
    }
  })();

  return unsub;
}

/*
* Create an invite
*/
function createInvite(email, projID, o) {
  const user = firebase.auth().currentUser;
  const id = `${email}_${projID}`;

  return invitesC.doc(id).set({
    invitedEmail: email,
    project: projID,
    by: user,
    at: serverTimestamp
  });
}

//--- User Info ---

// Creation of user info happens in the background, by Cloud Functions. The UI needs to be able to receive the info
// about the people working in the same project.
//
// Note: This information is not observed. Changes in the name/photo for existing fellow users would only take place
//    next time the user opens a project.
//
function getUserInfo(uid) {   // Promise of { name: string, photoURL: string }

  return userInfoC.doc(uid).get();
}


export {
  watchMyProjects,
  watchMyInvites
}

