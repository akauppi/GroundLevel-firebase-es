/*
* src/xListen/ContextError.js
*
* tbd. Is this in right place. Should there be two (i.e. make copy in the root??)
*
* Error with a context (what was happening) and optional data object (details; but don't provide user specific data!).
*/
class ContextError extends Error {
  constructor(context, ...rest) {    // (string, Error, obj?) | (string, string, obj?)
    let err, msg, obj;

    if (rest[0] instanceof Error) {
      [err, obj] = rest;
      msg = err.message;
    } else {
      [msg, obj] = rest;
      err = undefined;
    }

    const tail = obj ? `\t${ JSON.stringify(obj) }` : '';

    super(`While ${context}: ${msg}${tail}`);    // tbd. tune the format

    this.name = this.constructor.name;

    // Show the stack where the damage actually happened
    // tbd. how to do it?
    if (err?.stack) this.stack = err.stack;
  }
}

export {
  ContextError
}
