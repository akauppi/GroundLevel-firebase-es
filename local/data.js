/*
* local/data.js
*
* Initial data when run with local emulation.
*
* Change this to your liking, or remove.
*/

// Change the user id's to match your own. Check them from Firestore console.
//
const abc = "7wo7MczY0mStZXHQIKnKMuh1V3Y2"
const def = "def"

/*
* Modeled as:
*   [<document path>]: { <document field>: <value> }
*
* WARNING: Do NOT use 'Date.now()' or 'Date.parse()' - they return a number instead of a 'Date' instance!
*/
const docs = {
  // Project 1 - active project
  "/projects/1": {
    title: "Jolly Jumper",
    created: new Date('01 Jan 1880 00:00:00 GMT'),
    // no 'removed'
    authors: [abc],
    collaborators: [def]
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
    claimed: { by: 'def', at: new Date() }
  },

  // Invites (just one)
  "/invites/a@b.com:1": {
    email: "a@b.com",
    project: "1",
    asAuthor: false,
    by: "abc",
    at: new Date('07 Apr 2020 15:12:00 GMT')
  }
};

//ES6
export { docs }

// CommonJS
//module.exports = docs;

