// COPY OF 'firebase-jest-testing' 'config.js', until 'globalSetup' can take ES modules...
/*
* Provides access to e.g. 'firebase.json'
*/
const fs = require('fs');

const fn = process.env["FIREBASE_JSON"] || './firebase.json';

const firebaseJson = JSON.parse(
    fs.readFileSync(fn, 'utf8')
);

module.exports = firebaseJson;
