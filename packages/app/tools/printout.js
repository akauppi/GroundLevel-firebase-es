/*
* tools/printout.js
*
* Print messages from browser to the console log.
*
* A development level capture of the 'central' logging. There is no benefit in burdening the cloud with these; better
* to show them locally.
*
* Usage:
*   <<
*     $ PORT=8080 node tools/printout.js
*   <<
*
* Resources:
*   - "HTTP" (node docs)
*     -> https://nodejs.org/api/http.html#http_http
*/
import http from 'http'

const t0 = Date.now();  // ms

const port = process.env["PORT"] || (_ => {
  process.stderr.write("Please specify 'PORT' env.var.\n");
  process.exit(-3);
})();

/*
* Return a string time stamp (diff since launched; or current local time, which ever we fancy).
*/
function timeStamp() {

  // Note: Though JavaScript has '.toISOString' and 'Intl.DateTimeFormat', found the traditional way to be best approach.
  //const d = new Date();
  const dt = Date.now() - t0;

  const pad = (i,n) => (i+"").padStart(n,'0');

  const [hh, mm, ss, nnn] = [
    Math.floor(dt / (3600*1000)),
    Math.floor( (dt / (60*1000)) % 60),
    Math.floor((dt / 1000) % 60),
    dt % 1000
  ]

  const arr = [
    hh > 0 ? `${pad(hh,2)}:` : "",
    (hh > 0 || mm > 0) ? `${pad(mm,2)}:` : "",
    (hh > 0 || mm > 0 || ss > 0) ? `${pad(ss,2)}` : "",
    `.${pad(nnn,3)}`
  ];
  return arr.join('');

  /*** keep
  const [hh, mm, ss, nnn] = [
    //pad(d.getHours(), 2),
    //pad(d.getMinutes(), 2),
    //pad(d.getSeconds(), 2),
    //pad(d.getMilliseconds(), 3)

    pad( dt / (3600*1000), 2),
    pad( (dt / (60*1000)) % 60, 2),
    pad((dt / 1000) % 60, 2),
    pad(dt % 1000, 3)
  ];
  return `${hh}:${mm}:${ss}.${nnn}`;  // '11:49:46.772' (local time)   tbd. update comment
  ***/
}

const BG_RED = "\x1b[41m";
const RESET = "\x1b[0m";
const FG_GREEN = "\x1b[32m";
const FG_CYAN = "\x1b[36m";
const FG_YELLOW = "\x1b[33m";

const BLINK = "\x1b[5m";

const map = {
  debug: { f: console.debug,  s: FG_GREEN + "DEBUG: %s" + RESET },
  info: { f: console.info,    s: FG_CYAN + "INFO: %s" + RESET },
  warn: { f: console.warn,    s: FG_YELLOW + "WARN: %s" + RESET },
  error: { f: console.error,  s: BG_RED + "ERROR: %s" + RESET },
  fatal: { f: console.error,  s: BG_RED + FG_YELLOW + BLINK + "FATAL: %s" + RESET }    // no 'fatal' or 'critical' level
}

function logIt(level, msg) {
  const { f, s } = map[level] || (_ => {
    throw new Error(`Unexpected level: ${level}`);
  })();

  f(`[${ timeStamp() }] ${s}`, msg);
}

http.createServer( (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === 'POST') {          // POST /<level>    ; level = debug|info|warn|error|fatal
    const path = req.url;   // e.g. "/debug"

    const arr = path.match( /\/(debug|info|warn|error|fatal)/ );

    if (!arr) {   // level not known
      res.write("No such level; try with 'debug|info|warn|error|fatal'.");
      res.statusCode = 404;
      res.end();

    } else {
      const level = arr[1];

      const bodyParts = [];
      req.on('error', err => {
        console.error(err);
      }).on('data', chunk => {
        bodyParts.push(chunk);
      }).on('end', _ => {
        res.end();

        const body = Buffer.concat(bodyParts).toString();
        logIt(level, body);
      });
    }

  } else if (req.method === 'GET') {    // used by 'wait-for' to check when we are up
    res.write("OK\n");
    res.end();
  } else if (req.method === 'HEAD') {    // good manners to respond to both 'HEAD' and 'GET', from same path
    res.end();
  }
})
  .listen(port);

//process.stdout.write(`Listening on port: ${port}\n`);

// Testing...
if (false) {
  ['debug','info','warn','error','fatal'].forEach( lev => {
    logIt(lev, `Hey, ${lev}`);
  })
}
