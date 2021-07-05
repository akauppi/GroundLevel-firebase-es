#!/usr/bin/env node

// tbd. Suits better as a bash script. Just need to be able to read the ports.

/*
* Provide the command for launching Docker, for running Firebase Emulators.
*
* Used by both packages/backend and packages/app, but shares local folders differently:
*
*   - if launched from 'packages/backend', only that folder needs to be shared
*   - if launched from 'packages/app', the 'packages' level needs to be shared
*
* Usage:
*   <<
*     $ $(docker-run-cmd) "firebase emulators:start ..."
*   <<
*/
import { readFileSync } from 'fs'

const IMAGE = "firebase-ci-builder:9.12.1-node16-npm7"

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
const lastPart = pwd.split('/').slice(-1)[0];    // c1: "backend"|"app"
let vOpts, wOpts;

switch(lastPart) {
  case 'backend':
    vOpts = `${pwd}:/work`;
    wOpts = '/work';
    break;

  case 'app':
    vOpts = `${pwd}/..:/work`;
    wOpts = '/work/app';
    break;

  default:
    fail(`Unexpected current folder: ${lastPart}`)
}

// Note:
//    Keep '--sig-proxy=true' (though it is the default); it helps Firebase CLI release the ports. '=false' would lead
//    to dangling ports and needing to restart Docker.
//
const cmd = [
  'docker run --rm --sig-proxy=true',
  `-v ${vOpts}`,
  `-w ${wOpts}`,
  ...ports.flatMap(p => ['-p', `${p}:${p}`] ),
  IMAGE
].join(' ');

process.stdout.write(cmd);

process.stderr.write("Launching Docker... 🐳\n");

//---
function fail(msg) {
  process.stderr.write(`FAIL: ${msg}\n`);
  process.exit(-9);
}
