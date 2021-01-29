# Changelog

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
