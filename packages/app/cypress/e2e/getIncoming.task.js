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

const EMUL_HOST = process.env["EMUL_HOST"]    // DC ('make test'): direct to "emul-for-app"
  || "localhost";                             // Desktop Cypress

// Note: top level await
//
const DATABASE_URL = await import(FIREBASE_APP_JS).then( mod => mod.default.emulators?.database?.port )
  .then( databasePort => {
  databasePort || fail("Unable to read Realtime Database port");

  return `http://${ EMUL_HOST }:${databasePort}?ns=${PROJECT_ID}`;   // note: '?ns=...' is required!
});

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
async function getIncoming(subPath, expectedTimestamp) {    // ("{incs|logs|obs}", number) => Promise of { ... }
  typeof expectedTimestamp === 'number' || fail(`bad param: ${expectedTimestamp}`);    // counter-act accidentially calling with "2022-10-04T16:06:19.102Z" (happened)

  const ref = db.ref(`incoming/${subPath}`);    // incoming/{incs|logs|obs}/{..automatic index}/

  const prom = new Promise(res => {   // Promise of ...{matching Realtime Database object}

    // "... 'child_added' is triggered once for each existing child and then again, every time a new child is added".
    //
    if (true) {
      ref.orderByChild('ctx/clientTimestamp').equalTo(expectedTimestamp)      // tbd. enabling this gives "unspecified index" warnings in 'make test' output. Not sure, why. (works without, just not as elegant)
        .on('child_added', snapshot /*DataSnapshot*/ => {
          const o = snapshot.val();

          //console.log('!!! YAY - found the ONE', o);    // visible in 'make test' output

          res(o);
          ref.off('child_added');   // give up all listening of that path (#hack but works)
        }, (errorObject) => {
          console.error('Listen failed: ' + errorObject.name);
        });

    } else {
      // Alternate, dummer solution (until the one above works flawless..). Does not sort 'ctx/clientTimestamp'
      // on server-side.
      //
      let seen=0;
      ref.orderByValue().limitToLast(10)    // limiting to last values helps debugging (auto-indices are based on their creation times)
        .on('child_added', snapshot /*DataSnapshot*/ => {
        const o = snapshot.val();

        console.debug("Seen:", o);   // DEBUG

        if (o.ctx.clientTimestamp === expectedTimestamp) {
          console.log(`!!! YAY - found the ONE (${seen} skipped)`, o);    // visible in 'make test' output

          res(o);
          ref.off('child_added');   // give up all listening of that path (#hack but works)
        }
        seen++;
        // ...carry on listening
      }, (errorObject) => {
        console.error('Listen failed: ' + errorObject.name);
      });
    }
  });

  return prom;
}

export {
  getIncoming
}
