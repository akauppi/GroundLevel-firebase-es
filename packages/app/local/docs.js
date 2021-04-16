/*
* local/docs.js
*
* Initial data when run with local emulation.
*
* Change this to your liking, or remove.
*/

// Users used in the data
//
const abc = "dev"
const def = "def"

/*
* Modeled as:
*   [<document path>]: { <document field>: <value> }
*
* WARNING: Do NOT use 'Date.now()' or 'Date.parse()' - they return a number instead of a 'Date' instance!
*/
const docs = {
  // Project 1 - active
  "/projects/1": {
    title: "Jolly Jumper",
    created: new Date('01 Jan 1880 00:00:00 GMT'),
    // no 'removed'
    authors: [abc],
    members: [abc,def]
  },
  "/projects/1/symbols/1": {    // free symbol
    layer: 0,
    shape: "star",
    size: 50,
    fillColor: 'peru',
    center: { x: 100, y: 100 }
  },
  "/projects/1/symbols/2-claimed": {    // claimed by 'def'
    layer: 0,
    shape: "star",
    size: 50,
    fillColor: "peru",
    center: { x: 100, y: 100 },
    claimed: { by: def, at: new Date() }
  },

  // Invites (just one)
  "/invites/a@b.com:1": {
    email: "a@b.com",
    project: "1",
    asAuthor: false,
    by: abc,
    at: new Date('07 Apr 2020 15:12:00 GMT')
  }
};

//--- Users ---
//
// Only users you plan to log in as need to be listed (data may refer to others; those are just data fields).
//
// Unfortunately, Firebase auth dislikes data URLs. Using one:
//  <<
//    FirebaseAuthError: The photoURL field must be a valid URL.
//  <<
//
// - [ ] #help Report to Firebase? A data URL is a valid URL (at the very least, the error message could be revised).
//
// Work-around:
//    We can host the files, as a local .svg. Not worth it.
//    We could find a stable URL online that hosts a suitable icon.
//
// Emoji asterisk
//const urlAsterisk ="data:image/svg+xml,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-asterisk' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z'/%3E%3C/svg%3E";
//
// Emojies from -> https://icons.getbootstrap.com

const users = {
  [abc]: {
    displayName: 'Just Me',
    //photoURL: urlAsterisk

    // Note: due to our (own) back-end data model rules, we must provide some photo URL
    photoURL: "https://no.such.domain"
  }
};

export { docs, users }
