# Approach

## Testing Cloud Functions

We prime the database with a scenario that the functions then work on. 

Changes are left in the database (you can study them using the Emulator UI).

When tests are re-run, they try to clean away possible trash left by the earlier tests. If you wish to be dead sure, just restart the server at times. 

We test Cloud Functions with full access to all database contents (no security rules). This rises from the philosophy of orthogonal testing. One suite should test one thing. Others can then consider that done. The aim is more simplicity.


## Testing Security Rules

Using a fixed Firebase project ID ("rules-test"). This means you won't see the data in the Emulator UI.

The data is primed at the Jest `globalSetup` step, run prior to any tests. This is unlike with the Cloud Functions, where the data is primed at the emulator launch. Both approaches would work; this one keeps the data a bit closer to the tests themselves.

The `firebase-jest-testing` library allows us to run the tests as-if they wouldn't change the database, when access is allowed. Since we only test **whether we have access** to certain fields, there is no benefit in being able to change the data.

>NOTE: If this approach feels welcome to you, [PLEASE LOBBY](https://github.com/firebase/firebase-js-sdk/issues/2895) to the Firebase architects to make Firestore emulator + `@firebase/rules-unit-testing` library provide read-only access handles.
