/*
* src/mixins/myProjects.js
*
* Follow the projects that the current user has access to, and provides access to them.
*/
import { userMixin } from '@/mixins/user';
import { project } from '@/data/project';
import Vue from 'vue';
import { assert } from '@/util/assert';
import { fbCollection } from '@/fb';

// For most state, we can just use module-wide variables. There's only one logged in user, in the app.

let unsubscribe = null;   // call to stop the earlier Firestore tracker

// The project id's that the user can access. This is synced with Firestore projects getting added/removed.
//
// Q: How to have an observable set (array), in Vue? #help
//
const projectsRawVO = Vue.observable({
  value: null     // { <project-id>: Vue.observable({ title: string, ... }) | null (= no sign-in)
});

// Observable used by the mixin. Just the projects (no id's). Synced to the above by a watcher.
//
// Note: The frequency of projects list changing (for a single user) is pretty infrequent. Thus it doesn't matter
//    that we might do extra get's when it does.
//
const projectsLatestFirstVO = Vue.observable({
  _: []   // [ Vue.observable({ title: ..., ... }), ... ]
});

// Watch one observable, reflect changes in another
//
new Vue({   // from -> https://github.com/vuejs/vue/issues/9509#issuecomment-464460414
  created() {
    this.$watch(() => projectsRawVO.value, (o) => {   // ({ <project-id>: Vue.observable({ title: string, ... } } | null) => ()
      console.log('Watching projects change to:', o);

      let sorted;
      if (o === null) {
        sorted = [];
      } else {
        // Note: We recreate the array each time the set of projects changes (but hopefully not for project-internal
        //    changes!). Thus this whole watcher does the object-value-to-array transform, without losing reactivity.

        const copy = [... Object.values(o)];    // (copy because '.sort' sorts in place; playing safe...)
        sorted = copy.sort( (a,b) => {
          if (a.created > b.created) {  // latest first (reversed order)
            return -1;
          } else if (a.created < b.created) {
            return 1;
          } else {    // Quite unlikely - two projects created at the same time. Give deterministic sorting, nonetheless.
            return (a.title < b.title) ? -1 : (a.title > b.title) ? +1 : 0;
          }
        });
      }

      console.log('Reflecting sorted projects to:', sorted);

      projectsLatestFirstVO._ = sorted;
    });
  }
});

/*
* Called when the authenticated user changes.
*
* Sets 'projectsRawVO' to null (signed out), or populates with the projects we have access to (and keeps that set
* up to date).
*
* Note: Losing access really kicks in in the database rules side; we are not pulling copied objects out of our callers'
*     hands.
*/
function userChanged(uid) {    // (string | null) => ()
  console.log( "User changed to (myProjects):", uid);

  // Remove the earlier projects and (if logged in), repopulate.
  //
  if (uid === null) {
    projectsRawVO.value = null;
    unsubscribe();
    unsubscribe = null;

  } else {
    projectsRawVO.value = Vue.observable({});   // { <project-id>: Vue.observable({ title: string, ... }) }

    //assert( projects.value.size === 0 );    // (more complex to check for empty object)
    assert( unsubscribe === null );

    const projectsC = fbCollection('projects');

    /* Firestore note: Firestore does not provide OR queries over multiple collection keys (Feb 2020), so we have
    *     modeled the data so that access rights can be checked from a single key.
    */
    unsubscribe = projectsC
                    .where('collaborators', 'array-contains', uid)
        //.where(`access.${uid}`, 'in', ['author', 'contributor'])    <-- tbd. this would be a wonderful way to do it, but is unconventional and pollutes the root key space (well, unless 'access' is a map; let's try it some day? :) )
                    .onSnapshot( snapshot => {
                      snapshot.docChanges().forEach( change => {
                        // Note: Not using 'switch' because it doesn't provide scopes for the cases.

                        if (change.type === 'added') {
                          console.log('Adding project, id:', change.doc.id);  // DEBUG
                          const p = project(change.doc, uid);    // starts tracking changes to that project (title, data, ...)

                          const id = change.doc.id;
                          assert(!projectsRawVO.value[id]);
                          projectsRawVO.value[id] = p;

                        } else if (change.type === 'modified') {
                          // no-op for us (project objects take care)

                        } else if (change.type === 'removed') {
                          console.log('Project REMOVED or lost access to:', change.doc.data());

                          const id = change.doc.id;
                          assert(projectsRawVO.value[id]);   // should be there
                          delete projectsRawVO.value[id];   // remove the key
                        }
                      });
                    });
  }
}

/* Watch the 'user' change
*/
new Vue({
  mixins: [userMixin],
  watch: {
    user: (o) => {
      userChanged(o !== null ? o.uid : null );
    }
  }
});

//--- The Mixin ---
// Provides access to current user's projects
//
const myProjectsMixin = ({
  computed: {
    projectsLatestFirst: () => projectsLatestFirstVO._    // [ Vue.observable{ title: string, ... }, ... ]
  }
});

export {
  myProjectsMixin
}
