/*
* src/firebase/queries.js
*
* These are the use cases we have against the Firestore data. Having them in one place helps in modeling of the data
* (i.e. use cases first, security rules alongside it -> leads to modeling -> test and observe behaviour and costs).
*/
const db = firebase.firestore();

const projectsC = db.collection('projects');
const invitesC = db.collection('invites');

function informGen(f) {   // ((string, {...}) => ()) => ((QuerySnapshot) => ())
  return function inform(snapshot) {
    snapshot.docs.forEach(doc => {
      const id = doc.id;
      const data = doc.exists ? doc.data() : null;
      f(id, data);
    })
  };
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
    log.error("!!!", err.msg)
  }

  return () => {
    unsub1();
    ubsub2();
  }
}

/*
* Watch the projects the current user has been invited to.
*
* Note: An invite is simply an email - such a person might not even have a Firebase user-id, until they accept the
*     invite.
*
* Used by: populating the grid of projects
*
* The caller is expected to call the returned (unsubscribe) function, once watching is no longer needed.
*/
function watchMyInvites(f) {    // (/*id*/ string, { project: project-id, by: uid, at: timestamp }) => ()) => (() => ())
  const user = firebase.auth().currentUser;    // should be signed in, i.e. '.currentUser' is non-null
  assert(user);

  if (!user.emailConfirmed) {
    debugger;   // hmm.. we should confirm the email first, right?
  }
  const email = user.email;

  let unsub;   // tbd. here too, better way? #help
  try {
    unsub = invitesC.where( 'invitedEmail', '==', email )
      .onSnapshot( informGen(f) );
  }
  catch (err) {
    debugger;
    log.error("!!!", err.msg)
  }

  return unsub;
}

export {
  watchMyProjects,
  watchMyInvites
}