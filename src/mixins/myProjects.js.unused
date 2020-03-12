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

let unsubscribe = null;   // call to stop the earlier Firestore tracker

// References:
//    The sync-between-observables mechanism (IF we end up using it) is from
//      -> https://github.com/vuejs/vue/issues/9509#issuecomment-464460414

// Q: How to inspect a faceless (no rendering) component, in the Vue browser extension? #help #vuejs
//    - likely would need to list them in the App's '.components'.  <-- worth a try, but exposes these

const state = new Vue({
  data() {
    return {
      raw: new Map(),     // constant; contents change but the value doesn't. of: <project-id>: Vue.observable({ title: string, ... })
      'ding!!!': 0        // Gong played when 'raw' contents change!
    }
  },
  computed: {
    latestFirst: (vm) => {    // (view-model) => [ Vue.observable({ title: string. ... }), ... ]
      if (vm['ding!!!'] < 0) { assert(false); };    // so that we are triggered

      console.log("DONNNGGG!!!");

      const copy = [ ...vm.raw.values() ];
      const ret= copy.sort( (a,b) => {
        if (a.created > b.created) {  // latest first (reversed order)
          return -1;
        } else if (a.created < b.created) {
          return 1;
        } else {    // Quite unlikely - two projects created at the same time. Give deterministic sorting, nonetheless.
          return (a.title < b.title) ? -1 : (a.title > b.title) ? +1 : 0;
        }
      });

      console.log('Reflecting sorted projects to:', ret);
      return ret;
    }
  }
});

/*
* Called when the authenticated user changes.
*
* Updates 'state.raw' with the projects we have access to (and keeps that set up to date).
*
* Note: Losing access really kicks in in the database rules side; we are not pulling copied objects out of our callers'
*     hands.
*/
function userChanged(uid) {    // (string | null) => ()
  console.log( "User changed to (myProjects):", uid);

  // Remove the earlier projects and (if logged in), repopulate.
  //
  if (uid === null) {
    state.raw.clear();
    unsubscribe();
    unsubscribe = null;

  } else {
    assert( state.raw.size === 0 );
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
                          assert(!state.raw.has(id));
                          state.raw.set(id, p);

                        } else if (change.type === 'modified') {
                          // no-op for us (project objects take care)

                        } else if (change.type === 'removed') {
                          console.log('Project REMOVED or lost access to:', change.doc.data());

                          const id = change.doc.id;
                          assert(state.raw.has(id));   // should be there
                          state.raw.delete(id);
                        }
                      });

                      state['ding!!!'] = state['ding!!!'] + 1;    // trigger the compute of 'latestFirst'
                      debugger;
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
    projectsLatestFirst: () => state.latestFirst    // [ Vue.observable{ title: string, ... }, ... ]
  }
});

export {
  myProjectsMixin
}
