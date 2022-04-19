# Changelog

## 22-Mar-22

- Using Docker Compose conditional `depends_on:` (and healthchecks) for seeing services are up. 
  - No need for `wait-for-it` or `n-user`

## 21-Jul-21

- Wake-up of Cloud Functions, to have consistent test execution times. 
   - `npm test` now requires Emulators to be started, first.

## 4-Jun-21

- Testing using Docker.

## 17-May-21

- Changing to `firebase-jest-testing` 0.0.3-alpha.2
  - no need for a JS client!!!! 😄🚀

## 6-Apr-21

- Jest configuration as ES
- Dependency updates; Jest `27.0.0.next7`

## 19-Mar-21

- Dependency update; Jest `27.0.0.next5`; `npm test` still passes. :)

## 10-Mar-21

- Dependency update; Jest `27.0.0.next4` fixes problems; `npm test` passes!

## 29-Jan-21

- Brought `backend` back to main repo. 🥳
- Updated dependencies
- Experimenting with Jest 27 

## 27-Oct-20

- Renamed userInfo field `name` -> `displayName`, to be more consistent with Firebase.

## 13-Oct-20 (0.0.2-alpha)

- Change of data model:
  - discard `visitedC`; replaced by `projects/<project-id>/userInfo/<uid>/lastActive`
  - aims at providing all member-of-same-project info in Firestore, not needing the web client to call Cloud Functions (i.e. offline friendly)

## 30-Sep-20

- Spin-off from main repo
