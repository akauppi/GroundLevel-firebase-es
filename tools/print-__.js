#!/usr/bin/env node
/*
* tools/print-__.js
*
* Starts Firebase hosting and prints the active project's parameters.
*
* Usage:
*   <<
*     $ firebase emulators:exec --only hosting "node ./tools/print-__.js"
*   <<
*/
import * as http from 'http'
import { exec } from 'child_process'

const options = {
  host: 'localhost',
  port: 5000,
  path: '/__/firebase/init.js'
};

if (process.argv[2]) {    // launched underneath Firebase exec umbrella (localhost:5000 should be up)
  /*
  * Response is:
  *
  * <<
  *   if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
  *   var firebaseConfig = {
  *     ...   // <-- we want these fields, only
  *   };
  *   if (firebaseConfig) {
  *     firebase.initializeApp(firebaseConfig);
  *   }
  * <<
  */

  // Implementation note:
  //    Node 14.4.0 supports the 's' flag, but let's keep using the safe legacy option the default.
  //
  //const Re = /.+\svar firebaseConfig = ({.+\n});\s/s;    // capture the object

  const Re = /[\s\S]+\svar firebaseConfig = ({[\s\S]+\n});\s/;    // capture the object

  const callback = function(resp) {
    let str = '';

    resp.on('data', chunk => { str += chunk; });

    resp.on('end', () => {
      const arr= str.match(Re);
      if (!arr || !arr[1]) {
        console.assert(false, "Failed to pick the object - please fix!");
        process.exit(3);
      }

      console.log(`{{${arr[1]}}}`);
    });
  }

  http.request(options, callback).end();

} else {  // launched by the user

  // Run 'firebase use' to see that there's an active project (#later)

  exec("firebase emulators:exec --only hosting \"node ./tools/print-__.js a\"", (err, stdout, stderr) => {
    if (err) {
      throw new Error("Running Firebase emulator failed:", err);
    }

    // stdout has the Emulator output, and our script output, within '{{{ ... }}}'.

    const Re2 = /{{({[\s\S]+?})}}/;    // capture the JSON
    console.info( stdout.match(Re2)[1] );

    // stderr seems to be empty, but 'firebase emulators:exec' could place something there
    if (stderr) {
      console.error(stderr);  // pass on
    }
  });
}
