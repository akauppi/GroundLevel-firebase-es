/*
* fns-test/tools/projectId.js
*
* Dig current Firestore projectId from '../.firebaserc' (needed for showing data in the Emulator UI)
*/
import { strict as assert } from 'assert'
import fs from 'fs'

const projectId = (() => {
  const o = JSON.parse(
    fs.readFileSync('./.firebaserc', 'utf8')
  );
  const vs = Object.values(o["projects"]);
  assert(vs.length === 1);

  return vs[0];
})();

export {
  projectId
}
