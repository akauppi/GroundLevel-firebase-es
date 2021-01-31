/*
* src/xListen/RDoc.js
*
* A reactive construct for passing a single Firestore document's changes to the application (eventually the UI).
* Similar to 'RColl' for collections.
*
* - Allows implementation using the reactivity framework (e.g. Vue 3's) that is already at hand
* - detaches Firebase data observation from the UI framework
* - allows cancellation of the data stream (all the way to the Firebase API)
* - allows failing a data stream, by the producer
* - allows waiting for real data (async initialization)
*/
import { assert } from '/@/assert'
import { shallowRef, triggerRef } from 'vue'

import { RBase } from './RBase'

class RDoc extends RBase {
  // Note: consider using "private fields" (and public) once it's out in ES stable (stage 3 in Oct 2020):
  //    -> https://github.com/tc39/proposal-class-fields

  constructor( { context, conv } ) {   // ( { context: string, conv?: obj => obj } )
    super({ context, conv });

    // Note: The underlying 'Ref' is _not_ passed on to the caller. However, in order for the reactivity (with Vue)
    //    to work, our '.value' needs to be referenced from within a 'computed', 'watchEffect', or similar.
    //
    this._data = shallowRef();    // ShallowRef of { ..Firestore doc } | undefined

    this._firstLight = false;     // true once data has been received

    this.listener = {   // suitable for Firestore '.onSnapshot()' (a document)
      next: this._listenerNext.bind(this),
      error: super.listenerError.bind(this)
    }
  }

  _trigger() { triggerRef(this._data); }

  //--- Consumer methods ---

  // Naming '.value' is just a convention from Vue.js 'Ref'.
  //
  get value() {           // undefined | Map
    const v = this._data.value;   // Note: important we read this also initially (otherwise the reactiveness chain doesn't build for Vue.js)

    if (!this._firstLight) {
      return undefined;     // nothing, yet
    } else {
      super.preValue();     // throws up, if there's an error pending
      return v;
    }
  }

  /*** NEEDED
  // Provide a Promise that is resolved when initial data from the database arrives (plain '.value' gives 'undefined').
  //
  get valueProm() {
    return this._firstLightProm
      .then( _ => this.value() );
  }
  ***/

  //--- Producer methods ---
  //
  _listenerNext(dss) {    // (DocumentSnapShot) => (); this: RDoc
    assert(this._data);
    this.preSet();

    let o;
    if (dss.exists) {
      o = super._applyConv(dss.data());

      this._firstLight = true;
    }

    if (o !== undefined) {
      console.debug("Got:", o);
      this._data.value = o;   // no manual trigger needed
    } else {
      this._data.value = undefined;   // no manual trigger needed
    }
  }
}

export {
  RDoc
}
