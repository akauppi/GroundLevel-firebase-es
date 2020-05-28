/*
* src/firebase/utils.js
*
* Utilities for working with Firebase
*/

/*
* Firestore client provides timestamps as '{ seconds: integer, nanos: 0 }'. Let's convert those to JavaScript 'Date'.
*/
function convertDateFields(obj, ...fields ) {
  const o2 = {};   // collect date fields here

  fields.forEach( (key) => {
    assert( !(obj[key] instanceof Date) );    // Make sure Firestore does not provide as a 'Date'
    assert( typeof obj[key].seconds == 'number' );

    const epochSecs = obj[key].seconds;     // sub-second resolution could be reached from '.nanoseconds' (but we don't need it)

    o2[key] = new Date(epochSecs*1000);
  });

  return { ...obj, ...o2 }    // merge the objects
}

/*
* Firebase wraps 1..n documents into a snapshot. This helps unwrap them, and handle one at a time.
*/
function unshot(f) {    // (doc => ()) => (snapshot => ())
  return ss => ss.docs.forEach(f);
}

export {
  convertDateFields,
  unshot
}
