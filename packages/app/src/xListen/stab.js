/*
* src/xListen/stab.js
*
* Add '.xListen' to Firebase objects that carry '.onSnapshot' ('CollectionReference', 'Query', 'DocumentReference').
*
* This provides many benefits over the callback based API:
*
*   - provides a stream of document changes (opposed to callbacks)
*   - handles the unwrapping of docs (1..n) from a collection snapshot
*   - converts any timestamp values to JavaScript 'Date' (Firebase could do this..)
*   - provides optional filtering and conversion of the incoming data (for validation and/or schema changes) [1]
*   - catches errors and fails the stream if found
*   - allows the consumer to cancel the subscription
*
* The implementation is done using the reactivity enabling construct of the UI framework used (eg. Vue.js 3 'ShallowRef').
* This allows easy application side connection to UI constructs.
*
* [1]: Design note. For collections, such transform/validation needs to be done here, not at the consuming end, since
*     the scope of transform/validation is one Firebase document. For 'RDoc', this does not apply but for consistency,
*     the same mechanism is available.
*
* Note: Unsubscription is on _this modules'_ responsibility. The inner 'RColl'/'RDoc' don't (want to) know about it.
*     However, there is _one_ case where they need to do unsubscribing (if a 'conv' function throws an error, i.e.
*     consumer side validation fails). Luckily, our duck-taping of '.unsub' to the 'RColl'/'RDoc' object is available
*     there, as well. #dirty but beautiful
*/
import { assert } from '/@/assert'
import firebase from 'firebase/app'
import '@firebase/firestore'

import { RColl } from './RColl'
import { RDoc } from './RDoc'

/*
* Called via '<CollectionReference | Query>.xListen'
*/
function xListenColl(context, conv) {    // (string, (obj => obj|undefined)?) => [RColl, () => ()]; this: { onSnapshot }
  const rColl = new RColl({ context, conv });
  return [rColl, this.onSnapshot( rColl.listener )];
}

/*
* Called via '<DocumentReference>.xListen'
*/
function xListenDoc(context, conv) {    // (string, (obj => obj|undefined)?) => [RDoc, () => ()]; this: { onSnapshot }
  const rDoc = new RDoc({ context, conv });
  return [rDoc, this.onSnapshot( rDoc.listener )];
}

/*
* Extend 'CollectionReference', 'Query' and 'DocumentReference'
*
* Firebase JS client (8.0.x) is made with Typescript. It loses types at compilation, so we can only check the _form_
* of the objects.
*
* Note:
*   Extending a Firebase object seems the only way to make this simple for application level. We don't want them
*   to need to know the unsub details.
*/
function stab(proto, isColl) {
  assert (! proto.xListen, "Firebase class already has '.xListen'. Not extending.");
  assert(proto.onSnapshot, "Trying to extend an object without '.onSnapshot'.");

  const f = isColl ? xListenColl : xListenDoc;

  // Note: ULTRA IMPORTANT to declare this as 'function'. It uses 'this'.
  //
  proto.xListen = function ({ context, conv, filter }) {    // ({ context: string, conv?: obj => obj|null, filter?: obj => boolean }) => { .value, .unsub() }
    assert(this.onSnapshot);

    const conv2 = mergedConv(conv,filter);

    const [rx,unsub] = f.call(this, context, conv2);

    rx.unsub = () => {
      unsub();
      rx.unsub = () => { throw new Error("'.unsub' already called"); }
    };

    return rx;
  }
}

function mergedConv(conv, filter) {   // ( (obj => obj|undefined)?, (obj => boolean)?) => (obj => obj|undefined)?
  if (conv && filter) {
    throw new Error("Not prepared for both 'conv' and 'filter'; you can just return 'undefined' from 'conv'.");
  }

  if (conv) return conv;
  if (filter) return o => filter(o) ? o : undefined;
  return undefined;
}

if (true) {   // eslint-disable-line no-constant-condition
  const db = firebase.firestore();

  // CollectionReference
  const abcC = db.collection('abc');   // CollectionReference<DocumentData>
  assert(abcC.doc);    // form
  assert(abcC.where);
  assert(abcC.withConverter);
  assert(abcC.onSnapshot);
  //...
  stab(abcC.__proto__, true);
  assert(abcC.xListen);

  // Query
  const q = abcC.where('_', '!=', '_');    // Query<DocumentData>
  assert(q.onSnapshot);
  assert(q.where);
  assert(q.withConverter);
  //...
  stab(q.__proto__, true);
  assert(q.xListen);

  // DocumentReference
  const anyD = abcC.doc('def');   // DocumentReference<DocumentData>
  assert(anyD.onSnapshot);
  //...
  stab(anyD.__proto__, false);
  assert(anyD.xListen);

  //... more classes?
}

export {
}
