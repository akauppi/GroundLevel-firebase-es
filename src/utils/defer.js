/*
* A Promise that can be triggered from outside.
*
* From -> http://lea.verou.me/2016/12/resolve-promises-externally-with-this-one-weird-trick/
*
* Usage:
*   <<
*     const treeBuilt = defer();
*     ...
*     treeBuilt.resolve();
*     ...
*     await treeBuilt;
*   <<
*/
function defer() {
  let res, rej;

  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  promise.resolve = res;
  promise.reject = rej;

  return promise;
}

export { defer }

