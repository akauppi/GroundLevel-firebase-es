# Approach


## Testing Security Rules

The `firebase-jest-testing` library allows us to run the tests as-if they wouldn't change the database, when access is allowed. Since we only test **whether we have access** to certain fields, there is no benefit in being able to change the data.

>NOTE: If this approach feels welcome to you, [PLEASE LOBBY](https://github.com/firebase/firebase-js-sdk/issues/2895) to the Firebase architects to make Firestore emulator provide read-only access.
