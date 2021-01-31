/*
* init/central.js
*
* Central logging (for local and 'dev:online').
*
* This is a stub with the operations interface from 'GroundLevel-es-firebase-web'. It logs via REST APIs to the
* console that started the emulator etc.
*/
const port = import.meta.env.MODE === "dev_local" ? false : 5050;    // tbd. sync with 'package.json' #rework

/*
* Send to the command line
*/
async function post(url, s) {
  await fetch(url, {
    method: 'POST',
    body: s
  });
}

const format = (msg, opt) => !opt ? msg : `${msg} ${JSON.stringify(opt)}`;   // tbd. white space

const logGen = level => {    // (string) => (string [, object]) => ()
  if (!port) {    // LOCAL mode
    return () => { /*eat up*/ }
  }

  const url = `http://localhost:${port}/${level}`;

  return (msg, opt) => {
    const s = format(msg,opt);
    try {
      const ignore = post(url,s);    // free tail
    }
    catch(err) {
      // not so dear - we are just developing
      console.error('Unable to reach central log:', { url, err });
    }
  }
};

const lf = logGen("fatal");

/*
* Log, but also return an error with the logged message.
*
* Use:
*   <<
*     throw new log.fatal('msg', {...});
*   <<
*/
function logFatal(msg, opt) {
  const s = format(msg, opt);
  lf(msg, opt);

  return new Error(s);    // tbd. ideally, with the caller's stack (maybe 'throw' does it?)
}

const central = {
  debug: logGen("debug"),
  info: logGen("info"),
  warn: logGen("warn"),
  error: logGen("error"),
  fatal: logFatal
}

export {
  central
}
