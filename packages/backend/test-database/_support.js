/*
* test-database/_support.js
*
* Support code that doesn't have to do with any particular tests.
*
* NOTE!!!
*   There is NO DOCUMENTATION (Jun 2022) mentioning Firebase Emulators, Realtime Database access, and 'firebase-admin',
*   all three. The below code is based on 'firebase-admin's own tests [1], and should therefore be stable.
*
*     [1]: https://github.com/firebase/firebase-admin-node/blob/master/test/integration/setup.ts#L47-L101
*
* References:
*   - "Authenticate with limited privileges" (Firebase docs > Realtime Database > Admin)
*     -> https://firebase.google.com/docs/database/admin/start#authenticate-with-limited-privileges
*
*     ( Where one would expect information about setting up 'firebase-admin' for Emulation use... )
*/
import { initializeApp } from "firebase-admin/app"
import { getDatabase } from "firebase-admin/database"

import { afterAll } from "@jest/globals"

import { databasePort, projectId } from "./config.js"

/*
* Results we've had:
*
* I) Replicating [1]: FAILS with
*   <<
*     [2022-06-21T15:02:21.975Z]  @firebase/database: FIREBASE WARNING: {"code":"app/invalid-credential","message":"Credential implementation provided to initializeApp() via the \"credential\" property failed to fetch a valid Google OAuth2 access token with the following error: \"Error fetching access token: invalid_grant (Bad Request)\". There are two likely causes: (1) your server time is not properly synced or (2) your certificate key file has been revoked. To solve (1), re-sync the time on your server. To solve (2), make sure the key ID for your key file is still present at https://console.firebase.google.com/iam-admin/serviceaccounts/project. If not, generate a new key file at https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk."}
*   <<
*
*   That attempt never passes the Emulator port anywhere... Hmm...
*
* II)
*   ...
*/

// Values modeled according to [1] (above).
//
//const apiKey = "no-such";
//const serviceAccountId = "no-such@domain.com";
//const databaseUrl = `https://${ projectId }.firebaseio.com`;    // interestingly, 'databaseUrl' contains "firebaseio.com" also for local emulation..
const databaseUrl = `http://localhost:${databasePort}?ns=${projectId}`;

const defaultApp = initializeApp({
  projectId,
  databaseURL: databaseUrl
});

const allApps = new Map([["", defaultApp]]);    // Map of (""|uid|null) => FirebaseApp
  //
  // ECMAScript note: 'null' is allowed as a Map key (it seems)

function appAs(uid) {   // (string) => Database
  const app = allApps.get(uid) ||
    initializeApp({
      projectId,
      databaseURL: databaseUrl,
      databaseAuthVariableOverride: uid ? { uid } : null,   // like it is in [1]
    },
      `app-${ uid || "_" }`
    );

  allApps.set( uid, app );
  return app;
}

afterAll( async () => {
  await Promise.all(
    [... allApps.values() ].map( app => app.delete() )
  );
})

/***
* Provide an admin level handle to Realtime Database.
*/
function dbAdmin() {   // () => Database
  return getDatabase();
}

/***
 * Provide an impersonated (user level) handle to Realtime Database (so that Security Rules can be tested against).
 */
function dbAs(uid) {   // (string|null) => Database

  const app = appAs(uid);
  return getDatabase(app);
}

export {
  dbAdmin,
  dbAs
}
