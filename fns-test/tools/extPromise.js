/*
* fns-test/tools/extPromise.js
*
* Based on:
*   - "Resolve Javascript Promise outside function scope" (StackOverflow)
*     -> https://stackoverflow.com/questions/26150232/resolve-javascript-promise-outside-function-scope
*/

/*
* A 'Promise'-look-alike that can time out, and be resolved or rejected from the outside.
*
* Times out with '.resolve(undefined)'. Use other values in your code to differ from a timeout.
*/
function bestBeforePromise({ timeoutMs }) {   // ({ timeoutMs: <int> }) => Promise-like
  assert(timeoutMs > 0);

  let resLeak, rejLeak;

  const promise = new Promise((res, rej) => {
    resLeak = res;
    rejLeak = rej;
  });

  const h = setTimeout( () => { resLeak(); }, timeoutMs );

  return {
    resolve() { clearTimeout(h); resLeak(); },
    reject() { clearTimeout(h); rejLeak(); },
      //
    then: promise.then.bind(promise),   // these should make it look like 'Promise' in JavaScript
    catch: promise.catch.bind(promise),
    [Symbol.toStringTag]: 'Promise'
  }
}

export { bestBeforePromise }
