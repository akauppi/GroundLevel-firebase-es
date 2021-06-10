# Approach


## Testing Security Rules

The `firebase-jest-testing` library allows us to run the tests as-if they wouldn't change the database, when access is allowed. Since we only test **whether we have access** to certain fields, there is no benefit in being able to change the data.

>NOTE: If this approach feels welcome to you, [PLEASE LOBBY](https://github.com/firebase/firebase-js-sdk/issues/2895) to the Firebase architects to make Firestore emulator provide read-only access.


## Using the same back-end emulator also for the front end

Ideally, the backend is not aware of the front-end, at all.

The `npm run start` line in the `package.json` is an exception. It launches the emulators in a way that is suitable also for front-end development.

This allows us to:

- only use one kind of emulator configuration; not two

The front-end package sniffs, whether the Firebase Emulators are already running (port 4000 responds), and uses the existing instance if there is one.

