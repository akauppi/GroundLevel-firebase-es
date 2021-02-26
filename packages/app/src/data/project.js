/*
* src/data/project.js
*
* Follow a certain project.
*
* Used by:
*   - Project page
*/
import { assert } from '/@/assert'

import { db } from './common'

import { listenD } from '/@tools/listenD'

function projectSub(projectId) {    // (string) => Promise of [Ref of { ..projectsC doc }, () => ()]

  const prom = listenD(db, `projects/${projectId}`, { context: "Listening to 'projectD'" });
  return prom;
}

export {
  projectSub
}
