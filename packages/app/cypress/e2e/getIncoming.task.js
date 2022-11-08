/*
* cypress/e2e/getIncoming.task.js
*
* Task for awaiting "bridge/{prom|loki}" entries to show up in the Realtime Database.
*
* Reference:
*   - "Incredibly Powerful cy.task" (blog, Jun 2018)
*     -> https://glebbahmutov.com/blog/powerful-cy-task/
*/
import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

//import { databaseURL } from '../../tmp/local.config.json' assert { type: 'json' }   // does NOT WORK (ES import of JSON doesn't seem to support this)
  // available both in Desktop Cypress and DC ('make test')

import o from '../../tmp/local.config.json' assert { type: 'json' };
const { databaseURL } = o;
  // available both in Desktop Cypress and DC ('make test')

  // tbd. How come Desktop Cypress sees 'emul-for-app' (but it does)

function fail(msg) { throw new Error(msg) }

const db = (_ => {
  const app = initializeApp({ databaseURL });
  return getDatabase(app);
})();

/*
* Task for proving that a suitable "bridge/{prom|loki}/{generated-key}" document (will) exist(s).
*
* Note:
*   We do expect the document to exist; thus, there should not be a need for timing out the promise.
*
* Resolves with a document that matches 'expectedTimestamp'.
*
* NOTE: For debugging, throw exceptions or use 'console.{debug|log}'. Console logs are NOT available when running
*     desktop Cypress(*) but are seen when launched via 'make test'.
*
*     (*) The author doesn't know, how to see them.
*/
async function task_getIncoming([subPath, expectedTimestamp, filterSource]) {    // (["{prom|loki}", number, string?]) => Promise of { ... }
  typeof expectedTimestamp === 'number' || fail(`Unexpected 'expectedTimestamp' (not a number): ${ expectedTimestamp }`);    // counter-act passing a date object (happened)

  // Cannot pass a function from browser -> Node.js, but can pass a function source.
  //
  const filter = filterSource && eval(filterSource);    // object => boolean

  const ref = db.ref(`bridge/${subPath}`);    // bridge/{prom|loki}/{..automatic index}/

  const prom = new Promise(res => {   // Promise of ...{matching Realtime Database object}

    //console.log('\t>>> LOOKING FOR:', filterSource);

    // "... 'child_added' is triggered once for each existing child and then again, every time a new child is added".
    //
    /*if (true) {*/
      ref.orderByChild('ctx/clientTimestamp').equalTo(expectedTimestamp)      // tbd. enabling this gives "unspecified index" warnings in 'make test' output. Not sure, why.
        .on('child_added', (snapshot /*DataSnapshot*/) => {
          const o = snapshot.val();

          if (!filter || filter(o)) {
            console.log('!!! YAY - found the ONE', o);    // visible in 'make test' output

            res(o);
            ref.off('child_added');   // give up all listening of that path (#hack but works)
          }
        }, (errorObject) => {
          console.error('Listen failed: ' + errorObject.name);
        });

    /*}*/ /*** else {
      // Alternate, dummer solution (until the one above works flawless..). Does not sort 'ctx/clientTimestamp'
      // on server-side.
      //
      let seen=0;
      ref.orderByValue().limitToLast(10)    // limiting to last values helps debugging (auto-indices are based on their creation times)
        .on('child_added', snapshot /_*DataSnapshot*_/ => {
        const o = snapshot.val();

        console.debug("Seen:", o);   // DEBUG

        if (filter(o)) {
          console.debug(`!!! YAY - found the ONE (${seen} skipped)`, o);    // visible in 'make test' output

          res(o);
          ref.off('child_added');   // give up all listening of that path (#hack but works)
        }
        seen++;
        // ...carry on listening
      }, (errorObject) => {
        console.error('Listen failed: ' + errorObject.name);
      });
    } ***/
  });

  return prom;
}

export {
  task_getIncoming
}
