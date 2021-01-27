/*
* init/WrappedError.js
*
* Error wrapper for the use of 'central.fatal'.
*
* Note: Applications can freely use their own wrapped errors and throw those, as well.
*/
class WrappedError extends Error {    // new WrappedError(string, Error)
  constructor(msg, err) {
    super(`${msg} >> inner error: ${err.message}`);    // tbd. tune the format

    this.name = this.constructor.name;
    this.error = err;
  }
}

export {
  WrappedError
}
