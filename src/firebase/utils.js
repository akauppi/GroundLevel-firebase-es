/*
* src/firebase/utils.js
*
* Utilities for working with Firebase
*/
assert(true);   // we have assert

/*
* Firestore client provides timestamps as '{ seconds: integer, nanoseconds: 0 }'. Let's convert those to JavaScript 'Date'.
*/
function convertDateValue(o) {    // { seconds: integer, nanoseconds: 0 } => Date
  console.debug("Firestore date being converted:", o);
  assert( typeof o.seconds == 'number' );
  assert( typeof o.nanoseconds == 'number' );   // usually 0

  //return new Date(o.seconds*1000 + o.nanoseconds/1000000 /*ms since epoch*/);
  return o.toDate();
}

/*
* Firebase wraps 1..n documents into a snapshot. This helps unwrap them, and handle one at a time.
*/
function unshot(f) {    // (doc => ()) => (snapshot => ())
  return ss => ss.docs.forEach(f);
}

export {
  convertDateValue,
  unshot
}
