/*
* fns-test/tools/extPromise.js
*
* A 'Promise' that can time out, and be resolved from the outside.
*
* Based on:
*   - "Resolve Javascript Promise outside function scope" (StackOverflow)
*     -> https://stackoverflow.com/questions/26150232/resolve-javascript-promise-outside-function-scope
*/

/*
* Promise that provides a test certain time to '.resolve' from outside.
*
* Times out with '.resolve(undefined)'. Does not reject.
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
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    [Symbol.toStringTag]: 'Promise'
  }
}

export { bestBeforePromise }
