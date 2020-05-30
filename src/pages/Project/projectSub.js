/*
* src/pages/Project/projectSub.js
*
* Follow a certain project. This feeds changes from Firestore to the UI.
*/
const db = firebase.firestore();
import {reactive, watchEffect, nextTick} from "vue";
import {convertDateFields, unshot} from '/src/firebase/utils.js';


/*
* Provide a Promise of the reactive, ensuring only valid values are used.
*/
function reactiveProm(proxy) {   // (Proxy) => Promise of Proxy

  let stop;
  const prom = new Promise( (resolve,reject) => {
    stop = watchEffect(() => {
      //REMOVE
      //nextTick(() => { stop(); });    // byway: cannot reference 'stop' before it's initialized
      resolve(proxy)    // it has a value
    })
  })

  return prom.then( () => stop() );
}

/*
* Watch a certain project (as a 'ref').
*
* The user is expected to be logged in.
*
* tbd. Can we do clean when the 'ref' would be GC'ed? That way, there may not be a need for explicit unsubscribe
*     by the caller. #study #vue3
*/
function projectSub(id) {   // (id: string) => [ Promise of reactive( { ..projectsC-doc } ), unsub: () => () ]
  const projectD = db.doc(`projects/${id}`);

  // Vue 3 hope: having an async way to initiate 'reactive' (and 'ref') so that it's never at an uninitialized value.
  //  <<
  //    const project = await reactive().changedOnce();    // promise succeeds when the value is first time set
  //  <<

  // #Unsure
  //
  // Why use ref? We're making a reactive object which needs to track the fields received from Firestore callbacks.
  // Likely, most fields would remain the same. How best to express this in Vue 3 (so that it's also runtime efficient)?
  //
  // Reactive seems to lead to copying objects field-by-field. The wish is, 'ref' would do such for us behind the
  // curtains. Does someone know for sure? :) #help
  //
  const project = reactive({});

  function handleDoc(doc) {
    const tmp = doc.exists ? doc.data() : null;  // with optional '.removed'

    if (tmp && !('removed' in tmp)) {

      // Vue.js 3 advice: this is way too cumbersome. We want 'project' to reflect the fields in 'tmp'. The fields are
      // dynamic, as far as we care. Is 'reactive' unsuitable and better to use 'ref'?  If so, does 'ref' efficiently
      // skip copying values that did not change (which is most of them)? #help

      const removeKeys = Object.keys(project).filter( k => Object.keys(tmp).hasOwnProperty(k) )
      if (removeKeys.length > 0) {
        console.debug("Project updated - removing keys:", removeKeys);
      }
      removeKeys.forEach( k => {
        delete project[k];
      })

      Object.entries(tmp).forEach(([k,v]) => {
        project[k] = v;
      })

    } else {
      console.warning("Project was removed while we're working on it.");
      project.clear();
    }
  }

  let unsub;  // () => ()
  try {
    unsub = projectD.onSnapshot(unshot(handleDoc));
  } catch (err) {
    console.error("!!!", err);
    debugger;
  }

  // tbd. can we bind to '.delete' of project??

  // The caller gets the Proxy only once it carries real data.
  //
  return [reactiveProm(project), unsub];
}

export {
  projectSub
}
