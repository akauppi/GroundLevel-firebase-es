/*
* back-end/test-rules/docs.cjs
*
* Constant data used for the rules test cases
*/

const anyPastDate = new Date();

/*
* Modeled as:
*   [<document path>]: { <document field>: <value> }
*
* This means sub-collections are shown at the same level (flat hierarchy) as their logical parent; the path indicates
* the parenthood (this is quite suiting Firestore's view).
*
* WARNING: Do NOT use 'Date.now()' or 'Date.parse()' - they return a number instead of a 'Date' instance!
*/
const docs = {
  // Project 1 - active project
  "/projects/1": {
    title: "Jolly Jumper",
    created: new Date('01 Jan 1880 00:00:00 GMT'),
    // no 'removed'
    authors: ["abc"],
    collaborators: ["def"]
  },
  "/projects/1/visited/abc": {
    at: anyPastDate
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
    claimed: { by: 'def', at: anyPastDate }
  },

  // Project 2 - removed (archived)
  "/projects/2-removed": {
    title: "Jack",
    created: new Date('01 Jan 1880 00:00:00 GMT'),
    removed: anyPastDate,
    authors: ["abc"],
    collaborators: ["def"]
  },
  "/projects/2-removed/symbols/2": {
    layer: 0,
    shape: "star",
    size: 50,
    fillColor: "#234324",
    center: { x: 100, y: 100 }
  },

  // Project 3 - multiple authors
  "/projects/3-multiple-authors": {
    title: "Joe",
    created: new Date('01 Jan 1880 00:00:00 GMT'),
    // no '.removed'
    authors: ["abc","def"],
    collaborators: ["ghi"]
  },

  // Invites (just one)
  "/invites/a@b.com:1": {
    email: "a@b.com",
    project: "1",
    asAuthor: false,
    by: "abc",
    at: new Date('07 Apr 2020 15:12:00 GMT')
  },

  // Userinfo (just one)
  "/userinfo/def": {
    name: "William D.",
    photoURL: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dalton_Bill-edit.png"
      // photo in public domain: "image created 1887-1889 over 120 years ago" [source: Wikipedia]
  }
};

//export { docs }
module.exports = docs;
