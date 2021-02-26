/*
* src/data/project.js
*
* Follow a certain project.
*
* Used by:
*   - Project page
*/
import { assert } from '/@/assert'

import { dbD } from './common'

import { listenD } from '/@tools/listenD'

function projectSub(projectId) {    // (string) => [Ref of { ..projectsC doc }, () => ()]

  const pair = listenD(dbD(`projects/${projectId}`), { context: "Listening to 'projectD'" });
  return pair;
}

export {
  projectSub
}
