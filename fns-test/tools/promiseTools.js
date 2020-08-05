/*
* fns-test/tools/promiseTools.js
*
* Based on:
*   - "Resolve Javascript Promise outside function scope" (StackOverflow)
*     -> https://stackoverflow.com/questions/26150232/resolve-javascript-promise-outside-function-scope
*/

/*
* A 'Promise'-look-alike that can time out.
*
* - Can also be resolved from the outside.
*
* On time out:
*   - if 'onTimeout' has been given, resolves with it
*   - if none has been given, rejects
*
* Times out with '.resolve(undefined)'. Use other values in your code to differ from a timeout.
*/
function bestBeforePromise({ timeoutMs, onTimeout }) {   // ({ timeoutMs: <int>, onTimeout: () => any }) => Promise-like
  if (timeoutMs <= 0) {
    throw new Error(`Unexpected 'timeoutMs' (not >0): ${timeoutMs}`);
  }

  let resLeak, rejLeak;
  const promise = new Promise((res, rej) => {
    resLeak = res;
    rejLeak = rej;
  });

  // Note: 'setTimeout' needs a 'clearTimeout' even when it triggers. Otherwise, Jest claims there is an open handle.
  //
  const timer = setTimeout( () => {
    clearTimeout(timer);    // tbd. is this needed?

    if (onTimeout) resLeak( onTimeout() );
    else rejLeak( new Error("timed out") );

    //console.debug("!!! Timed out");
  }, timeoutMs );

  return {
    resolve(v) {
      clearTimeout(timer);
      resLeak(v);
    },
    then: promise.then.bind(promise),   // these should make it look like 'Promise' in JavaScript
    catch: promise.catch.bind(promise),
    [Symbol.toStringTag]: 'Promise'
  }
}

export { bestBeforePromise }
