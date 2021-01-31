/*
* src/xListen/RColl.js
*
* A reactive construct for passing Firestore collection's changes to the application (eventually the UI).
*
* - Allows implementation using the reactivity framework (e.g. Vue 3's) that is already at hand
* - detaches Firebase data observation from the UI framework
* - allows cancellation of the data stream (all the way to the Firebase API)
* - allows failing a data stream
*
* Note: Failing and cancellation make this more on-par with proper data streams, like RxJS. However, the
*     intention is to _avoid_ the need for bringing such libraries in, and work with what the UI framework offers.
*
* We try to use the simplest means of reactivity offered by the UI framework.
*/
import { assert } from '/@/assert'
import { shallowRef, triggerRef } from 'vue'

import { RBase } from './RBase'

class RColl extends RBase {
  // Note: consider using "private fields" (and public) once it's out in ES stable (stage 3 in Oct 2020):
  //    -> https://github.com/tc39/proposal-class-fields

  /*
  * Implementation note:
  *   Using a 'Map' to present the collection (group of documents). The 'Map' is always the same; documents can get
  *   removed.
  */
  constructor( { context, conv } ) {   // ( { context: string, conv?: obj => obj } )
    super({ context, conv });

    this._data = shallowRef( new Map() );

    this.listener = {   // suitable for Firestore '.onSnapshot()' (collections)
      next: this._listenerNext.bind(this),
      error: this.listenerError.bind(this)
    };
  }

  // Called by 'RBase', on failure
  _trigger() { triggerRef(this._data); }

  //--- Consumer methods ---

  // Make it look like Vue.js 'Ref' (could be anything).
  //
  get value() {
    super.preValue();   // throw up, if there's an error pending
    return this._data.value;
  }

  //--- Producer methods ---

  /*
  * Firestore 'onSnapshot' handler.
  */
  _listenerNext(ss) {    // (QuerySnapshot) => ()
    assert(this._data);
    this.preSet();

    for( const doc of ss.docs ) {   // QueryDocumentSnapshot
      const id = doc.id;
      console.debug("Listening: doc id:", id);  // DEBUG
      assert(id);

      let o;
      if (doc.exists) {
        o = super._applyConv(doc.data());
      }
      if (o !== undefined) {
        console.debug("Got:", o);
        this._data.value.set(id,o);
        this._trigger();
      } else {
        this._data.value.delete(id);
        this._trigger();
      }
    }
  }
}

export {
  RColl
}
