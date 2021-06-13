#!/usr/bin/env node

/*
* Helps launch Firebase Emulators, under Docker.
*
* Used by both packages/backend and packages/app, but both running within the 'packages/backend' folder. There's just
* one 'firebase.json', but the launch command differs (app needs auth; backend doesn't).
*
* Usage:
*   <<
*     $ docker-run "firebase emulators:start ..."
*   <<
*
* Reads 'firebase.json' and binds the ports found there, to the Docker image.
*/
import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'

const IMAGE = "firebase-ci-builder:9.12.1-node16-npm7"
  //"firebase-ci-builder:9.11.0-node16-npm7"

const [cmd] = process.argv.slice(2);

if (!cmd) {   // usage
  process.stderr.write(`Usage: ${ process.argv[0] } "firebase emulators:start ...\n"`);
  process.exit(-2);
}

// Read 'firebase.json' from current work directory
//
const ports = (_ => {   // => Array of integer
  const raw = readFileSync('./firebase.json');
  const json = JSON.parse(raw);

  const arr = ["firestore","functions","auth","ui"].map( k => {
    return (json.emulators && json.emulators[k] && json.emulators[k].port)    // cannot use '?.' because of the varying 'k'
      || fail(`Cannot read 'emulators.${k}.port' from 'firebase.json'`);
    }
  );
  return arr;
})();

const pwd=process.cwd()

// Launch Docker and keep it running
//
const args=[
  'run', '--rm',
  '--sig-proxy=true',
  '-v', `${pwd}:/work`, '-w', '/work',
  ...( ports.flatMap(p => ['-p', `${p}:${p}`] ) ),
  IMAGE
];

console.info("Launching Docker... 🐳\n");

// Notes on Node.js spawn:
//  - child process does NOT have access to env.vars of us (only those we pass with 'env').
//
// Reference:
//    https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
//
/*const childProcess =*/ spawnSync('docker',[
  ...args,
  ...cmd.split(' ')
], {
  stdio: 'inherit',
  shell: true
});

function fail(msg) {
  process.stderr.write(`FAIL: ${msg}\n`);
  process.exit(-9);
}
