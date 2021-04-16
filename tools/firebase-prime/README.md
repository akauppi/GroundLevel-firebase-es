# firebase-prime

Tools to prime a Firestore emulated instance with:

- users
- data

## Approach

We're using the *client side* Firebase library (since it's available for a front end project anyhow) and the trick that the emulator allows `{ uid: "owner" }` to act as admin.

