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

function fail(msg) { throw new Error(msg); }

/*
* Format like 'console.log' would: allows for 0..n extra args.
*/
function format(msg, ...args) {
  const tmp = [msg, ...args.map( JSON.stringify )];
  return tmp.join(' ');
}

const logGen = level => {    // ("info"|"warn"|"error") => (string [, object]) => ()
  if (!port) {    // LOCAL mode

    // Show on browser console; it's best to get eg. Firestore errors seen.
    //
    const i = level === 'fatal' ? 'error':level;
    const logF = console[i] || fail(`No such function: 'console.${level}'` );

    return (msg, ...args) => {
      logF( format(`[central] ${format(msg,...args)}`));
    }
  }

  const url = `http://localhost:${port}/${level}`;

  return (msg, ...args) => {
    const s = format(msg,...args);

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

const showOnBrowser = new Map([
  ["warn", console.warn],
  ["error", console.error]
]);

const central = {
  info: logGen('info'),
  warn: logGen('warn'),
  error: logGen('error')
}

export { central }
