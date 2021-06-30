# firebase-prime

Tools to prime a Firestore emulated instance with:

- users
- data

## Approach

<strike>We're using</strike> We'd like to use the *client side* Firebase library (since it's available for a front end project anyhow) <strike>and the trick that the emulator allows `{ uid: "owner" }` to act as admin.</strike>

>Status: For now, using `firebase-admin` for priming the data.

## To-do

Sync the approach with `firebase-jest-testing` code. We don't want to use it (to avoid dependency on Jest
from the front end), but we can code in a similar (proven) fashion.
