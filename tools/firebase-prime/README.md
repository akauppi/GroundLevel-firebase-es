# firebase-prime

Tools to prime a Firestore emulated instance with:

- users
- data

## Approach

<strike>We're using</strike> We'd like to use the *client side* Firebase library (since it's available for a front end project anyhow) <strike>and the trick that the emulator allows `{ uid: "owner" }` to act as admin.</strike>

>Status: For now, using `firebase-admin`, but the The Day Will Come when we can do this with client library!
