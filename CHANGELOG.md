# Changelog

## latest

- Very clumsy error panel (shows uncaught errors in UI), but works.
- Taking Functions emulator's port (in `dev:local`) from `firebase.json`.
- Multiple bugs solved regarding `npm run prod:rollup:serve` (also upstream)
- Moved front-end code to `app/`.

## 13-Sep-20

- Using `firebase-jest-testing` from `npm` registry

## 11-Sep-20

- Enabled minification for both Vite and Rollup; updated size comparisons
- Separated Cloud Functions only needed in `dev:local` and testing; no longer deploying them
- Created `central.js` for central logging.
- Brought in `@airbrake/browser` and `toastify` - **both having problems with Rollup builds**, thus initializing them in init scripts. 💩
- Muchos debugging to get all combinations running (considering tilting towards Vite also in production).

## 1-Sep-20

- Deployment all the way to cloud - with both Rollup and Vite - works. 🌞🌞

## 31-Aug-20

- `npm run dev:local` does not need even creation of a Firebase project, any more (good!) 🌞 

## 27-Aug-20

- Adapted to using the changed API in `@akauppi/firebase-jest-testing@0.0.1-alpha.10`

## 26-Aug-20

- Adapted to using `@akauppi/firebase-jest-testing` published via GitHub Packages

## 25-Aug-20

- Adapted to `firebase-jest-testing` 0.0.1-alpha.7. Tests pass; stable.

## 23-Aug-20

- Using `firebase-jest-testing` for the back-end testing
 
## 4-Aug-20

- Setup dialog replaces signout menu

## 19-Jul-20

- Central logging works both under local emulation and online.

## 25-Jun-20

- Seeding data to `npm run dev:local`
- `README` revised, covers two dev modes
- Local mode selection by `--mode dev_local`

## 20-Jun-20

- Logging via Cloud Functions (not documented)

## 19-Jun-20

- Firebase authentication delay handled within `router.js`. Good.
- Front-end running against emulators with 'npm run dev:local'.

## 14-Apr-20

- Updated all dependencies
   - including Rollup to 2.x -> [changelog entry](https://github.com/rollup/rollup/releases/tag/v2.0.0)
- Moved Vue Router to be pulled via `npm` (was via CDN). Bigger bundle but easier to track versions.

## 6-Apr-20

- Updated minor dependencies and Firebase tools (global) to version 8.

## 1-Apr-20

- Declaring Rules testing ready!
  - some failing/ignored tests, but the guarded-session immutable testing framework looks good.

## 24-Feb-20

- Proper-looking drop-down menu for the sign-out

## ~19-Feb-20

- Authentication works
- Mentioned to some prior template authors, and at Vue.js Amsterdam, for feedback
