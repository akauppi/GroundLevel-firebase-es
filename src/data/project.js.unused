/*
* src/data/project.js
*
* Access and tracking of changes to a certain project document, in Firestore.
*
* We do some abstraction on the 'lastUsed' field:
*   - show its value only for the current user
*   - update the stored value automatically, if a project is opened
*/
import Vue from "vue";
import { fbCollection } from '@/fb';

/*
* tbd. would be cool if we can provide a 'Project' class that still has observable members. Can we do that, in say, Vue 3? #help
*/

/*
* Object for following a single project, updating the fields as they change in the database.
*/
function project(doc, uid) {    // (firestore doc, string) => Vue.observable { title: ..., ... }

  const obs = Vue.observable({
    title: doc.title,
    created: doc.created,
    //authors: ...    // not necessary
    //collaborators: ...

    // only expose the user's own time stamp ('null' if none)
    lastUsed: null
  });

  /* tbd.
  const symbolsC = doc.0;   // tbd.

  // Q: Can we add our methods just like this?
  obs.symbols = function () {   // () => Vue.observable( [{ ... }, ...] )
    debugger;   // tbd.

    return symbols(symbolsC)
  };
  */

  // Track changes and reflect them in the observable
  //
  // Note: Cannot use 'doc' as such for watching snapshots (it itself comes from a 'C.where(...).onSnapshot' watch and
  //    those don't seem to have '.onSnapshot'.
  //
  const id = doc.id;
  const projectsC = fbCollection('projects');

  const unsubscribe = projectsC.doc(id)
    .onSnapshot( snapshot => {
      const o = doc.data();
      console.log("Project inner change observed:", o);

      obs.title = o.title;
      obs.created = o.created;    // shouldn't change
      //...

      obs.lastUsed = o.lastUsed ? o.lastUsed[uid] : null;
    });

  // Note: We can likely just let the '.onSnapshot' run. If the project is completely deleted, Firebase hopefully
  //    takes care of cleaning the trackers. Otherwise, pass the return value to the caller, who know if the project
  //    gets removed.

  return obs;
}

export { project }
