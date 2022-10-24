# Wishes for Firebase libraries

## `firebase-functions`: call `initializeApp` for us?

Why would Firebase Cloud Functions automatically call `initializeApp` (with no params) when it's obvious that would be needed (e.g. a Firestore trigger)?

Now one needs to do both `initializeApp` and `getFirestore`.

