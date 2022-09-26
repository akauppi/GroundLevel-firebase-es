#!/bin/which node
/*
* tools/fireport.js
*
* Usage:
*   <<
*     fireport.js "firebase{|.app}.js" "{firestore|database|functions|ui|auth}"
*   <<
*
* Picks up a certain port value from the 'firebase[.app].js' definition. This allows us to steer the ports from one
* place.
*/
import { existsSync } from 'fs'

const [filename, which] = (_ => {
  const [a, b] = process.argv.slice(2);

  if (!existsSync(a)) {
    process.stderr.write(`\nERROR: Cannot find '${a}'\n\n`);
    process.exit(1);
  }
  return [a,b];
})();

const emulators = await import(`../${filename}`).then( mod => mod.default?.emulators );

const port = emulators ? emulators[which]?.port : undefined;

if (!port) {
  process.stderr.write(`ERROR: Unable to find 'emulators.${which}.port'\n\n`);
  process.exit(2);

} else {
  process.stdout.write( `${port}\n` );
}
