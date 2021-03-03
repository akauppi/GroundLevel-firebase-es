/*
* src/data/project.js
*
* Follow a certain project.
*
* Used by:
*   - Project page
*/
import { assert } from '/@/assert'

import { db } from '/@firebase'
import { listenD } from '/@tools/listen'

function projectSub(projectId) {    // (string) => [Ref of { ..projectsC doc }, () => ()]

  const pair = listenD(db, `projects/${projectId}`);
  return pair;
}

export {
  projectSub
}
