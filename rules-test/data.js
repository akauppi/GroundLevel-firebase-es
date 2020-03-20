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
*/
const projects = {
  "/projects/1": {
    title: "Jolly Jumper",
    created: Date.parse('01 Jan 1880 00:00:00 GMT'),
    // no 'removed'
    authors: ["abc"],
    collaborators: ["def"]
  },
  "/projects/1/visited/abc": { at: Date.now() },
  "/projects/1/symbols/1": {    // free symbol
    layer: 0,
    shape: "star",
    size: 50,
    fillColor: 'peru',
    center: { x: 100, y: 100 }
  },
  "/projects/1/symbols/2": {    // claimed by 'def'
    layer: 0,
    shape: "star",
    size: 50,
    fillColor: "peru",
    center: { x: 100, y: 100 },
    claimed: { by: 'def', at: Date.now() }
  },

  // Project 2 - removed (archived)
  "/projects/2": {
    title: "Jack",
    created: Date.parse('01 Jan 1880 00:00:00 GMT'),
    removed: Date.now(),
    authors: ["abc"],
    collaborators: ["def"]
  },
  "/projects/2/symbols/2": {
    layer: 0,
    shape: "star",
    size: 50,
    fillColor: "#234324",
    center: { x: 100, y: 100 }
  }
};

const data = {
  projects: projects
};

export { data }

