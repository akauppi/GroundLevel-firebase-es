# Back-end

This folder contains the back-end features, and tests for them.

## Testing Cloud Functions

### Approach

We prime the database with a scenario that the functions then work on. 

Changes are left in the database (you can study them using the Emulator UI).

When tests are re-run, they try to clean away possible trash left by the earlier tests. If you wish to be dead sure, just restart the server at times. 

We test Cloud Functions with full access to all database contents (no security rules). This rises from the philosophy of orthogonal testing. One suite should test one thing. Others can then consider that done. The aim is more simplicity. 

## Testing Security Rules

### Approach

Using a fixed Firebase project ID ("rules-test"). This means you won't see the data in the Emulator UI.

The data is primed at the Jest `globalSetup` step, run prior to any tests. This is unlike with the Cloud Functions, where the data is primed at the emulator launch. Both approaches would work; this one keeps the data a bit closer to the tests themselves.

Tests are run as-if they wouldn't change the database, if successful. This is managed with the tools from the `firebase-jest-testing` library. Since we only test **whether we have access** to certain fields, there is no benefit in being able to change the data. In fact, it is creating confusion. 

>NOTE: If this approach feels welcome to you, PLEASE LOBBY to the Firebase architects to make Firestore emulator + `@firebase/testing` library provide read-only access handles.


<!-- tbd. not sure if all the references are important, any more. Revise.

## References

- Cloud Functions > [Get Started](https://firebase.google.com/docs/functions/get-started) (Firebase docs)
- [Testing Firestore Security Rules With the Emulator](https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/) (article, Oct 2018)
- [Connect your app and start prototyping](https://firebase.google.com/docs/emulator-suite/connect_and_prototype) (Firebase docs)
- [Firebase Security Rules and Tests for Firebase](https://medium.com/flutter-community/firestore-security-rules-and-tests-for-firebase-e195bdbea198) (blog, Feb 2020)

-->

