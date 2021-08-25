/*
* hack/ack-trigger.js
*
* Context:
*   imported from '../functions-warm-up' and that in turn from '../functions'.
*
* Trigger that something got ready; waking up the command line (hopefully) waiting for this information.
*/
import { existsSync, unlinkSync, writeFileSync } from 'fs'

/*
* Tell that 'key' is now ready.
*
* The files get created in the 'functions' directory (which is appropriate).
*/
function ackTrigger(key) {   // (string) => ()
  const fn = `.ack.${key}`;

  (!existsSync(fn)) || fail(`Ack file ALREADY EXISTS: ${fn}`);

  // Write it!
  //
  writeFileSync(fn, "");

  console.log(`SIGNALLED: ${fn}`);

  // Self-destruct
  //
  process.on('exit', () => {
    unlinkSync(fn);
  });
}

function fail(msg) { throw new Error(msg) }

export {
  ackTrigger
}
