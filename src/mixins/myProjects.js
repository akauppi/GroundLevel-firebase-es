/*
* src/mixins/myProjects.js
*
* Follow the projects that the current user has access to, and provide (also write) access to them.
* This is a bridge between Firestore state and the application.
*/
import { userMixin } from "@/mixins/user";

// Using a 'collection' function allows us to override, for testing purposes.
// tbd. Consider moving to a separate module, later.
//
const db = firebase.firestore();
function fbCollection(name) {   // (string) => collection-handle
  return db.collection(name);
}

//--- The state ---
// Just one state per application (one user at a time)
//
let unsubscribe = null;   // stop the earlier Firestore tracker; PRIVATE

/*
* Called when the authenticated user changes.
*/
function userChanged(vm, uid) {    // (view-model, string | null) => ()
  console.log( "User changed to (myProjects):", uid);

  // Remove the earlier projects and (if logged in), repopulate.
  //
  vm.projects = [];
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }

  if (uid !== null) {
    /* Firestore note: Firestore does not provide OR queries over multiple collection keys, so we need to have the data
    *     modeled such that our project-we-have-access-to can be checked from one key ('collaborators').
    */
    unsubscribe = fbCollection('projects')
                    .where('collaborators', 'array-contains', uid)
                    //.where(`access.${uid}`, 'in', ['author', 'contributor'])    <-- this would be a wonderful way to do it, but is unconventional and pollutes the root key space #cleanup
                    .onSnapshot( snapshot => {
                      snapshot.docChanges().forEach( change => {
                        switch (change.type) {
                          case 'added':
                            console.log('Project ADDED:', change.doc.data());
                            //tbd. vm.projects.push( { _id: o.id, title: o.title, lastUsed: o['last-used'] } );   // tbd. Use of 'last-used' in Firestore doc keys may be bad example?
                            break;

                          case 'modified':
                            console.log('Project MODIFIED:', change.doc.data());
                            //tbd. replace said project (by id)
                            break;

                          case 'removed':
                            console.log('Project REMOVED or lost access to:', change.doc.data());
                            //tbd. remove said project (by id)
                            break;
                        }
                      });
                    });
  }
}

//--- The Mixin ---
// Provides access to current user's projects
//
const myProjectsMixin = ({
  mixins: [userMixin],    // tbd. ideally, we'd just privately have access to 'user'; not exposing it as our API
  data: () => ({
    projects: []    // { _id: unique-string, title: string, lastUsed: time-stamp, ... }     // tbd. make 'ProjectHandle' class!!!
  }),
  /*
  created() {   // Note: no 'vm' parameter; forced to use 'this' #help
    const vm = this;
  },
  */
  watch: {
    user: function (o) {    // (must use 'function' to have 'this')
      const vm = this;
      userChanged(vm, o !== null ? o.uid : null );
    }
  },
});

export {
  myProjectsMixin
}
