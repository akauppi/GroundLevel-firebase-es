# Changelog

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
