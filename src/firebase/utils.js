/*
* src/firebase/utils.js
*
* Utilities for working with Firebase
*/

/*** REMOVE
/*
* Firestore client provides timestamps as '{ seconds: integer, nanos: 0 }'. Let's convert those to JavaScript 'Date'.
*_/
// DEPRECATED: use 'convertDataValue' instead (field by field)
function convertDateFieldsDEPRECATED(obj, ...fields ) {
  const o2 = {};   // collect date fields here

  fields.forEach( (key) => {
    assert( !(obj[key] instanceof Date) );    // Make sure Firestore does not provide as a 'Date'
    assert( typeof obj[key].seconds == 'number' );

    const epochSecs = obj[key].seconds;     // sub-second resolution could be reached from '.nanoseconds' (but we don't need it)

    o2[key] = new Date(epochSecs*1000);
  });

  return { ...obj, ...o2 }    // merge the objects
}
***/

/*
* Firestore client provides timestamps as '{ seconds: integer, nanoseconds: 0 }'. Let's convert those to JavaScript 'Date'.
*/
function convertDateValue(o) {    // { seconds: integer, nanoseconds: 0 } => Date
  console.debug("Firestore date being converted:", o);
  assert( typeof o.seconds == 'number' );
  assert( typeof o.nanoseconds == 'number' );   // usually 0

  return new Date(o.seconds*1000 + o.nanoseconds/1000000 /*ms since epoch*/);
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
