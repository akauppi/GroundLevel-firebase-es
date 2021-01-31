/*
* Common code for 'RColl' and 'RDoc'
*/
import { assert } from '/@/assert'
import { ContextError } from "./ContextError"

class RBase {
  // Note: "private fields" support (enable when latest public supports it, and rename all to '_any' -> '#any'):
  // - [ ] Safari
  // - [ ] Firefox
  //
  // https://caniuse.com/mdn-javascript_classes_private_class_fields
  //
  //#context
  //#conv
  //#failWith
  //#triggerOnFail    // note: different name than derived classes might have (until we can make it private)

  // Provided by derived class (like "protected" interface):
  //_trigger    // () => ()

  constructor( { context, conv } ) {    // ( { context: string, conv?: obj => obj|undefined } )
    this._context = context;
    this._conv = conv;
    this._failWith = undefined;   // undefined | Error
  }

  //--- Consumer ---

  /*
  * Check whether there's a pending error, and throw it up.
  */
  preValue() {  // () => ()
    if (this._failWith) {
      throw new ContextError(this._context, this._failWith);
    }
  }

  //--- Producer ---

  /*
  * When getting new values, check that there's no error (should not be; Firestore docs promise to stop delivering on error).
  */
  preSet() {  // () => ()
    assert (!this._failWith, 'Still getting data on a failed stream.');
  }

  /*
  * Firestore has reported an error. Set it aside. Derived class will trigger the consumer.
  *
  * Note: Cancelling the upstream is not needed ("..there is no need to detach your listener [after an error].") (Firestore docs)
  */
  _fail(msg) {
    if (this._failWith) { throw new Error("Cannot fail twice"); }

    this._failWith = new Error(`Data source failed with: ${msg}`);
    this._trigger();    // wake up the consumer (provided by derived class)
  }

  //--- From Firestore 'onSnapshot'

  /*
  * An error can happen at any time, during a snapshot listener's lifespan.
  */
  listenerError(fsError) {   // FirestoreError => (); this: RBase
    const { code, message } = fsError;
      //
      // code: FirestoreErrorCode   (follows are codes we've met in the wild)
      //      'permission-denied'   Some query not allowed; error contains eg. "@ L216" for helping in debugging.
      // message: eg. 'No matching allow statements'
      // name: 'FirebaseError'
      // stack?:

    this._fail( new Error(`Firebase error (${code}): ${message}`) );    // #tune the format
  }

  /*
  * Helper for both 'RColl' and 'RDoc'
  *
  * Converts all timestamp values to JavaScript 'Date' + applies custom conversion, if provided.
  */
  _applyConv(dataRaw) {    // obj => obj|undefined
    assert(this.unsub);

    // Timestamp conversion
    const data1 = oMap( dataRaw, v => {
      if (typeof v === 'object' && "seconds" in v && "nanoseconds" in v) {
        console.debug("Converting a time stamp:", v);   // DEBUG
        return v.toDate();
      } else {
        return v;
      }
    });

    // Allow 'conv' to do any field conversions, or validation. If it throws an exception, the stream is failed
    // (consumer will get it at next read).
    //
    // Note: In THIS CASE we need to manually unsubscribe the stream. We just happen to know that '.unsub' has been
    //    placed there, by the higher levels.
    //
    let data2;

    const conv = this._conv;
    if (!conv) {
      data2 = data1;
    } else {
      try {
        data2 = conv(data1);
      }
      catch(err) {
        this._fail( new Error(`Data validation failed: ${err.message}`) );
        this.unsub();
        return;   // value does not matter; consumer will end up in a throw
      }
    }

    return data2;
  }
}

/*
* JavaScript does not have '.map()' for objects. Use this.
*
* If 'fn' returns 'undefined', the entry is filtered out from the object.
*
* Note: Having the value first in the callback (and not using tuples) allows for easy mapping with or without
*     regard to the key ('oMap({...}, v => ...)' works).
*/
function oMap(o, fn) {    // (object, (any, string) => any|undefined)
  const out = {};

  for (const [k,v] of Object.entries(o)) {
    const v2 = fn(v,k);
    if (v2 !== undefined) {
      out[k] = v2;
    }
  }
  return out;
}

export {
  RBase
}
