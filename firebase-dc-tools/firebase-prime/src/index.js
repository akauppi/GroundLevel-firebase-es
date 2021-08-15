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

import { init as initConfig } from './config.js'

async function mainWrapper(docsFn, usersFn) {
  initConfig(
    program.opts().project || failInternal('--project missing'),   // Commander should have required it
    program.opts().host || failInternal('--host missing')               // Commander should have placed the default
  );

  // Little trickery to import relative to current directory.
  //
  const { docs } = await import(`${ process.cwd() }/${docsFn}`);
  const { users } = await import(`${ process.cwd() }/${usersFn}`);

  if (!docs) fail(`Missing 'docs' export in: ${docsFn}`);
  if (!users) fail( `Missing 'users' export in: ${usersFn}`);

  // Note: By importing 'main' dynamically, we allow 'config' to have been initialized, first.
  //
  const { main } = await import('./main.js');
  return main(docs, users);
}

function fail(msg) {
  console.error(msg);
  process.exit(2);
}

function failInternal(msg) { throw new Error(msg) }
