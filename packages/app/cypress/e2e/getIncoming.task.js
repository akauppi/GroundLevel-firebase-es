/*
* cypress/e2e/getIncoming.task.js
*
* Task for awaiting an "incoming/{incs|logs|obs}" entries to show up in the Realtime Database.
*
* Reference:
*   - "Incredibly Powerful cy.task" (blog, Jun 2018)
*     -> https://glebbahmutov.com/blog/powerful-cy-task/
*/
import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

function fail(msg) { throw new Error(msg) }

const PROJECT_ID = "demo-main";   // tbd. from central location

const FIREBASE_APP_JS = process.env["FIREBASE_APP_JS"]  // DC: mapped to '/work'
  || '../../../backend/firebase.app.js';

const EMUL_HOST = process.env["EMUL_HOST"]    // DC: direct access to "emul-for-app"
  || "localhost";

// Note: top level await
//
const DATABASE_URL = await (async () => {
  //    Until then, parsing the 'FIREBASE_DATABASE_EMULATOR_HOST' env.var. (undocumented??) is the best choice
  //    (was unable to pass DC 'environment: DATABASE_PORT=...' here, for some reason).
  //
  const databasePort = await import(FIREBASE_APP_JS).then(mod => mod.default.emulators?.database?.port)
      || fail("Unable to read Realtime Database port");

  return `http://${ EMUL_HOST }:${databasePort}?ns=${PROJECT_ID}`;   // note: '?ns=...' is required!
})();

const db = (_ => {
  const app = initializeApp({ databaseURL: DATABASE_URL });
  return getDatabase(app);
})();

/*
* Task for proving that a suitable "incoming/{...}/{generated-key}" document (will) exist(s).
*
* Note:
*   We do expect the document to exist; thus, there should not be a need for timing out the promise.
*
* Resolves with a document that matches 'expectedTimestamp'.
*
* NOTE: Cannot use any 'cy.*' features, within a function like this.
*
* NOTE 2: For debugging, throw exceptions or use 'console.{debug|log}'. Console logs are NOT available when running
*     desktop Cypress(*) but are seen when launched via 'make test'.
*
*     (*) The author doesn't know, how to see them.
*/
async function getIncoming(subPath, expectedTimestamp) {    // ("{incs|logs|obs}", number) => [Promise of { ... }, cancel()]

  const ref = db.ref(`incoming/${subPath}`);
  const at = expectedTimestamp;

  const prom = new Promise(res => {   // Promise of ...{matching Realtime Database object}
    let seen=0;

    // "'child_added' is triggered once for each existing child and then again, every time a new child is added".
    //
    /***
    ref.orderByChild('clientTimestamp').equalTo(at)      // tbd. enabling this gives "unspecified index" warnings in 'make test' output. Not sure, why. (works without, just not as elegant)
      .on('child_added', snapshot /_*DataSnapshot*_/ => {
        const o = snapshot.val();

        console.log('!!! YAY - found the ONE', o);    // visible in 'make test' output

        res(o);
        ref.off('child_added');   // give up all listening of that path (#hack but works)
      }, (errorObject) => {
        console.error('Listen failed: ' + errorObject.name);
      });
    ***/
    ref
      .on('child_added', snapshot /*DataSnapshot*/ => {
      const o = snapshot.val();

      if (o.clientTimestamp === expectedTimestamp) {
        console.log(`!!! YAY - found the ONE (${seen} skipped)`, o);    // visible in 'make test' output

        res(o);
        ref.off('child_added');   // give up all listening of that path (#hack but works)
      }
      seen++;
      // ...carry on listening
    }, (errorObject) => {
      console.error('Listen failed: ' + errorObject.name);
    });
  });

  return prom;
}

/***
* Task for proving that a suitable "incoming/{...}/{generated-key}" document exists.
*
* Resolves with the document, if it arises within 'timeoutMs'.
* Otherwise rejects.
*
* NOTE: Cannot use any 'cy.*' features, within a function like this.
*
* NOTE 3: For debugging, throw exceptions or use 'console.{debug|log}'. Console logs are NOT available when running
*     Cypress GUI but are seen when launched via 'make test'.
*_/
async function getIncoming_polling(subPath, expectedTimestamp, timeoutMs) {    // ("{incs|logs|obs}", number, int) => Promise of { ... }

  const ref = db.ref(`incoming/${subPath}`);
  const at = expectedTimestamp;

  // Query logic
  //
  const gen = _ => new Promise(res => {   // () => Promise of Array of { ..., clientTimestamp: number }
    ref.orderByChild('clientTimestamp').equalTo(at).once('value', ss => {
      const arr = [];

      if (ss.exists()) {
        ss.forEach( x => {
          arr.push(x);
        });
      }
      res(arr);   // Array of {...object in Realtime Database}
    });
  });

  const [doc /_*, ...*_/] = await tryUntil( Date.now() + timeoutMs, gen);
  doc || fail("INTERNAL: expected a doc object");

  return doc;
}

/_*
* Perform a duty, with steady interval, until it succeeds or we time out.
*_/
async function tryUntil(tUntil, promGen) {   // (number, () => Promise of Array of FirebaseUser => Promise of Array of FirebaseUser (non-empty)
  const t0 = Date.now();

  while(Date.now() < tUntil) {
    const arr = await promGen();
    if (arr.length > 0) {
      console.info(`Found a match in ${ Date.now() - t0 }ms (polling every ${POLL_INTERVAL_MS})`);
        // 4357 ms
      return arr;
    }

    await sleep(POLL_INTERVAL_MS);
  }
  fail("timed out");
}

function sleep(ms) {    // (int) => Promise of ()

  return new Promise(res => setTimeout(res, ms) );
}
const getIncoming = getIncoming_polling;
**/

export {
  getIncoming
}
