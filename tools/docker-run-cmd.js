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

let itFriendly = true;

switch(lastPart) {
  case 'backend':
    vOpts = `${pwd}:/work`;
    wOpts = '/work';
    itFriendly = false;
    break;

  case 'app':
    vOpts = `${pwd}/..:/work`;
    wOpts = '/work/app';
    itFriendly = false;
    break;

  //case 'app-ops':
  case 'app-deploy-ops':    // for now
    vOpts = `${pwd}:/work`;
    wOpts = '/work';
    break;

  default:
    fail(`Unexpected current folder: ${lastPart}`)
}

// Docker parameters:
//
// '-it':
//    Allows Ctrl-C termination to reach Firebase Emulators. This, in turn, allows them to gracefully shut down.
//    Without this, we get "broken pipe" error on the terminal (if the Docker output is piped), and Docker may need
//    restarts, at times. IMPORTANT!
//
//    Note:
//      '-it' cannot be used if launched via 'concurrently' (app, backup)
//        <<
//          the input device is not a TTY
//        <<
//
// '--log-driver local':
//    Inspired by this SO answer [1] ..and Docker docs [2] state:
//      >>
//        For other situations, the “local” logging driver is recommended
//      <<
//
//    Setting to "none" takes away logs from Docker Desktop (those may be handy), but "local" is great!!!
//
// '-a stdout -a stderr':
//    Based on [1]. Makes piping Docker output way more tolerant to Ctrl-C.
//
// [1]: https://stackoverflow.com/a/50161815/14455
// [2]: https://docs.docker.com/config/containers/logging/configure/
//
const cmd = [
  `docker run ${ itFriendly ? '-it':'-i' } --rm`,
  '--log-driver local',
  '-a stdout -a stderr',
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
