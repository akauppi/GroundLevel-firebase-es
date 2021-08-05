#!/usr/bin/env node

/*
* Command line entry point.
*/
//import { program } from 'commander'
//import { program } from 'commander/esm.mjs'   // this worked (8.1)
import { Command } from 'commander/esm.mjs'   // according to instructions (Aug 2021; https://www.npmjs.com/package/commander)
const program = new Command();

program
  .arguments('<docs-file> <users-file>')
  .option('--host <hostname>', 'Hostname, where Firebase Emulators are running', 'localhost')
  .requiredOption('--project <project-id>', 'Firebase project id')
  .action(mainWrapper)
  .parse();

async function mainWrapper(docsFn, usersFn) {
  const projectId = program.opts().project || failInternal('--project not provided (Commander should give an error?)');
  const host = program.opts().host || failInternal('no \'host\' value (Commander should have used the default)');

  global.chewedOpts = { projectId, host };

  // Little trickery to import relative to current directory.
  //
  const { docs } = await import(`${ process.cwd() }/${docsFn}`);
  const { users } = await import(`${ process.cwd() }/${usersFn}`);

  if (!docs) fail(`Missing 'docs' export in: ${docsFn}`);
  if (!users) fail( `Missing 'users' export in: ${usersFn}`);

  // Note: By importing 'main' itself dynamically, we allow 'config' to pass the projectId and host parameters.
  //
  const { main } = await import('./main.js');
  return main(docs, users);
}

function fail(msg) {
  console.error(msg);
  process.exit(2);
}
