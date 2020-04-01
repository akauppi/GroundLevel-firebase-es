/*
* rules-test/data.js
*
* Constant data used for the rules test cases
*/

/*
* Modeled as:
*   [<document path>]: { <document field>: <value> }
*
* This means sub-collections are shown at the same level (flat hierarchy) as their logical parent; the path indicates
* the parenthood (this is quite suiting Firestore's view).
*
* WARNING: Do NOT use 'Date.now()' or 'Date.parse()' - they return a number instead of a 'Date' instance!
*/
const projects = {
  // Project 1 - active project
  "/projects/1": {
    title: "Jolly Jumper",
    created: new Date('01 Jan 1880 00:00:00 GMT'),
    // no 'removed'
    authors: ["abc"],
    collaborators: ["def"]
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

  // Project 2 - removed (archived)
  "/projects/2-removed": {
    title: "Jack",
    created: new Date('01 Jan 1880 00:00:00 GMT'),
    removed: new Date(),
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
  }
};

const data = {
  ...projects
};

export { data }

