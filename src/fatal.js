/*
* src/fatal.js
*
* A custom 'Fatal' error, thrown when the app gets to a dead end (e.g. configuration mismatches), or an assert fails
* (essentially the same thing). No dependencies.
*
* Note:
*   - Once the app is up, it can catch such and show them also in the UI. Until then, they will show only in the
*     console.
*
* References:
*   - "Extending Error in Javascript with ES6 syntax & Babel" (SO)
*     -> https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel/32749533
*/

const hasCaptureStackTrace = typeof Error.captureStackTrace === 'function';   // node has it

if (!hasCaptureStackTrace) {
  console.debug("No 'Error.captureStackTrace' - using '(new Error()).stack'");
}

// Note: There's no standard way in JS to get the caller's stack trace (ideally, we'd like to point directly to the
//      'Fatal(...)' line. But this is okay-ish. The calling line is still in the stack (UI code could filter us out).
//
class Fatal extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name;

    if (hasCaptureStackTrace) {
      Error.captureStackTrace(this.caller, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }
  }
}

function FatalF(id, msg) {
  throw new Fatal(msg);
}

// Id's for the calls (could be used, similar to how 'central' works)
const fatalConfigurationMismatch = {};

export {
  FatalF as Fatal,
  fatalConfigurationMismatch
}
