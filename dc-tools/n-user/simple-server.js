#!/usr/bin/env bash
":" //# comment; exec /usr/bin/env node --input-type=module - "$@" < "$0"
// from -> https://stackoverflow.com/questions/48179714/how-can-an-es6-module-be-run-as-a-script-in-node

/*
* Open a simple, dummy port, only to signal "we're ready!" for another DC container.
*
* Usage:
*   <<
*     $ serve-port 1234   # continues running
*   <<
*/
import { createServer } from 'http'

const [argv2] = process.argv.slice(2);

const PORT = parseInt(argv2) || (_ => {
  process.stderr.write(`Usage: simple-server <port>\n\n`);
  process.exit(-2);
  return 0;   // extinguishes IDE underlines
})();

createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
}).listen(PORT, "0.0.0.0");
