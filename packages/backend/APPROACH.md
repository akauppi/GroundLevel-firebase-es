# Approach


## Testing Security Rules

The `firebase-jest-testing` library allows us to run the tests as-if they wouldn't change the database, when access is allowed.


## Waking up Cloud Functions

The Firebase Emulators (`firebase-tools` 9.16.0) leave Cloud Functions "resting" after launch.

This is tedious, and causes initial tests easily to time out. We've counteracted this with:

- as part of the functions themselves, if emulation is detected, the functions are triggered so that they wake up.


This wake-up happens *after* Emulators have opened port 4000 for shop, so tests don't have an easy mechanism to know when Cloud Functions really have woken up.

This is not a problem with manual use (starting `npm run start` in one terminal; moving to another; executing tests with `npm run test:fns:...`), but it does bother `npm test`. We'd need to place something like `sleep 7` (seconds) in the command to have `npm test` launch safely - and any such constant delays are normally a no-no. Changed `npm test` so that it -- for now -- requires Firebase Emulators already to have been started, in the background.

### Deeper analysis

Why do Cloud Functions take up to 5..6 s to wake up, if executed under Docker?

Are Firebase aware of this - something like 100's ms wake-up time would not cause these problems, but multiple seconds do.

### Implications to CI

Left CI out of this. It runs in its own environment (not under Docker) and performance is better.

It matters slightly if the timings are off, but as long as the tests pass within timeout limits, CI does its job.

