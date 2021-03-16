/*
* vitebox/ops/central.js
*
* Central logging - development version
*
* Logs via REST APIs to the console that started the emulator etc.
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

    // Also print on browser console, if warn/error/fatal
    const f = showOnBrowser.get(level);
    if (f) f(s);

    try {
      /*const ignore =*/ post(url,s);    // free tail
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
*     throw log.fatal('msg', {...});
*   <<
*/
function fatal(msg, opt) {
  const s = format(msg, opt);
  lf(msg, opt);

  return new Error(s);    // tbd. ideally, with the caller's stack (maybe 'throw' does it?)
}

const showOnBrowser = new Map([
  ["warn", console.warn],
  ["error", console.error],
  ["fatal", console.error]    // '.error' is highest level in browsers
]);

const central = {
  debug: logGen('debug'),
  info: logGen('info'),
  warn: logGen('warn'),
  error: logGen('error'),
  fatal
}

// tbd. Do we want to use as:
//export default central;   // import central from '@ops/central'
export { central };       // import { central } from '@ops/central'
