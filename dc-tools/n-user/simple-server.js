#!/usr/bin/env node

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
  process.stderr.write(`Usage: ${ process.argv[1].match(/^.+\/(.+)$/)[1] } <port>\n\n`);
  process.exit(-2);
  return 0;   // extinguishes IDE underlines
})();

createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
}).listen(PORT);
