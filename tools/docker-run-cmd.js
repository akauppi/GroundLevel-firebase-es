#!/usr/bin/env node

// tbd. Suits better as a bash script. Just need to be able to read the ports.

/*
* Provide the command for launching Docker, for running Firebase Emulators.
*
* Used by packages/{backend|app|app-ops}, but shares local folders differently:
*
*   - if launched from 'packages/backend', only that folder needs to be shared
*   - if launched from 'packages/app', the 'packages' level needs to be shared
*   - if launched from 'packages/app-ops', only that folder needs to be shared
*
* Usage:
*   <<
*     $ $(docker-run-cmd) "firebase emulators:start ..."
*   <<
*/
import { readFileSync } from 'fs'

const IMAGE = "firebase-ci-builder:9.16.0-node16-npm7"

// Read 'firebase.json' from current work directory
//
// 'required':  Array of the emulators expected
//
function portsFromFirebaseJson(required) {   // (Array of string) => Array of integer
  const raw = readFileSync('./firebase.json');
  const json = JSON.parse(raw);

  const got = Object.entries(json.emulators || {})
    .flatMap( ([k,{ port }]) => port ? [k]:[] )   // take only the ones with '.port'

  const [A,B] = [required,got];

  const diffA = A.filter( x => !B.includes(x) );    // required but not in 'firebase.json'
  const diffB = B.filter( x => !A.includes(x) );    // extras in 'firebase.json'

  function fmt(arr) {
    return (arr.length > 1) ? `{${ arr.join(',') }}` : arr;
  }

  if (diffA.length > 0) {
    fail(`Expected 'emulators.${ fmt(diffA) }.port' in 'firebase.json' but not there.`);
  }

  if (diffB.length > 0) {
    fail(`Unexpected 'emulators.${ fmt(diffB) }.port' in 'firebase.json'.`);
  }

  return required.map( k => json.emulators[k].port || fail(`'emulators.${k}.port' not found in 'firebase.json'`));
}

const pwd=process.cwd()
const lastPart = pwd.split('/').slice(-1)[0];    // c1: "backend"|"app"|"app-ops"
let vOpts, wOpts;

const ports = portsFromFirebaseJson(
  lastPart !== 'app-deploy-ops' ? ["firestore","functions","auth","ui"] : ["hosting"]
);  // Array of int

switch(lastPart) {
  case 'backend':
    vOpts = `${pwd}:/work`;
    wOpts = '/work';
    break;

  case 'app':
    vOpts = `${pwd}/..:/work`;
    wOpts = '/work/app';
    break;

  //case 'app-ops':
  case 'app-deploy-ops':    // for now
    vOpts = `${pwd}:/work`;
    wOpts = '/work';
    break;

  default:
    fail(`Unexpected current folder: ${lastPart}`)
}

// Note:
//    Keep '--sig-proxy=true' (though it is the default); it helps Firebase CLI release the ports. '=false' would lead
//    to dangling ports and needing to restart Docker.
//
//    ^-- really? See [1] which happens also with '--sig-proxy=true'.
//    [1]: https://github.com/akauppi/GroundLevel-firebase-es/issues/67
//
const cmd = [
  'docker run --rm',
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
