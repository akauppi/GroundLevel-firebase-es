/*
* tools/__.js
*
* List the Firebase configuration, exposed by Firebase hosting.
*/
import * as http from 'http';

const options = {
  host: 'localhost',
  port: 5000,
  path: '/__/firebase/init.js'
};

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
//    Node 14.4.0 supports the 's' flag, but until we are sure which Node version brought it in (so we can mention
//    in README as a requirement), let's keep the safe legacy option the default.
// ES2018
//const Re = /.+\svar firebaseConfig = ({.+\n});\s/s;    // capture the object

const Re = /[\s\S]+\svar firebaseConfig = ({[\s\S]+\n});\s/;    // capture the object

const callback = function(resp) {
  let str = '';

  resp.on('data', chunk => { str += chunk; });

  resp.on('end', () => {
    const arr= str.match(Re);
    if (!arr || !arr[1]) {
      console.error("Failed to pick the object - please fix!");
      console.debug(str);
      assert(false);
    }

    console.log(arr[1]);
  });
}

http.request(options, callback).end();
