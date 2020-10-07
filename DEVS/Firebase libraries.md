# Firebase libraries

Firebase has quite many server and client side JavaScript libraries, and their life cycles, quality etc. differ from each other.

Firebase seems to be wanting to clarify this and e.g. renamed `@firebase/testing` as `@firebase/rules-unit-testing` in Aug 2020, which does better convey its purpose.

Here is a list of the ones we've come across (all authored by Firebase), to help one see their relevance.



## Table

>Note: This table is a "best effort" and we aim to edit it, from time to time, when better real world knowledge of the various libraries is gained.

Open issues is listed because their number, and the oldest age are indicators of how well the repo is attended by the authors. (This author will remove that column if/when Firebase cleans up their act.)

||What is it?|When to use?|Open issues|
|---|---|---|---|
|**Client side**|
|&nbsp;&nbsp;`firebase`|Main JavaScript client|Browser app or client side node.js (applies Security Rules)|[220](https://github.com/firebase/firebase-js-sdk/issues) (23-Jul-20); oldest 18-May-2017; includes `@firebase/testing` (deprecated) and `@firebase/rules-unit-testing` issues|
|&nbsp;&nbsp;`firebaseui-web`|Authentication UI for web|Browser app with auth|[114](https://github.com/firebase/firebaseui-web/issues) <!--was: 109--> (1-Oct-20); oldest 24-Jun-2016
|**Server side**|
|&nbsp;&nbsp;`firebase-admin`|Access to Firebase data, bypassing Security Rules.|Declaring Cloud Functions; Tests against an emulator; Priming data; Not for the browser.|[36](https://github.com/firebase/firebase-admin-node/issues) (27-Aug-20); oldest 7-Jun-2017|
|&nbsp;&nbsp;`firebase-functions`|A library needed for implementing Cloud Functions||[35](https://github.com/firebase/firebase-functions/issues) (27-Aug-20); oldest 19-Jun-2018|
|**Testing libraries**|
|&nbsp;&nbsp;`@firebase/rules-unit-testing`|".. for testing Security Rules with the Realtime Database or Cloud Firestore emulators".|Testing Firestore authentication.<br/><br/>Benefits:<ul><li>*"supports mocking auth in Security Rules"*</li><li>*Any database will accept the string `"owner"` as an admin auth token.*</li></ul>|Part of the `firebase-js-sdk` repo: `packages/rules-unit-testing`. *No separate issues tracking* <br/><br/>[8](https://github.com/firebase/firebase-js-sdk/issues?q=is%3Aopen+is%3Aissue+label%3Atesting-sdk) (27-Aug-20); oldest 16-May-2019|
|&nbsp;&nbsp;`firebase-functions-test`|Tools for making *unit tests* on Cloud Functions.|Unit testing Cloud Functions within the `functions` folder. We don't do it but run integration tests against local emulators instead, using the normal `firebase` library.|[9](https://github.com/firebase/firebase-functions-test/issues) (23-Jul-20); oldest 8-Apr-2018|
|**Developer tools**|
|&nbsp;&nbsp;`firebase-tools`|Command Line Interface (CLI)|Development and deployment; Launching emulators. You need it.|[146](https://github.com/firebase/firebase-tools/issues) (23-Jul-20); oldest 16-Dec-2015|
|&nbsp;&nbsp;`superstatic`|Library used for Firebase hosting (authored by Firebase)|Firebase hosting|[19](https://github.com/firebase/superstatic/issues) (18-Sep-20); oldest 25-Sep-2014|
|**Deprecated**|
|`@firebase/testing` -> `@firebase/rules-unit-testing`|Security Rules testing, until Aug 2020.|

Note: There are also other, non-official packages that are *not* deployed by Firebase. **Stay clear of those!** It would be a good phishing attempt to make something people would install, by accident. **DO NOT TRUST THE NAMES**.


### Why list the oldest issues?

Having old (say, over 6 months) issues in a repo is unmotivating for employees and causes a jungle of discussions to browse through for visitors. A healthy repo would have relatively fast turn-around times, issues being assigned to milestones or resolved as "nah, we won't do that".

Tracking a project's energy and roadmap is easier when old issues are not standing in the way.

That's why they are listed. Once they are <1 year in the past, we'll remove the listing. 

🧹

<!-- this is confusing
### Where does the confusion rise from??

Entries like [this](https://stackoverflow.com/questions/62566957/cannot-call-firestore-from-unit-tests/62586875#62586875) show the "admin" library being used with tests (not run as a privileged environment, but just from the development environment command line).

Also [Unit testing of Cloud Functions](https://firebase.google.com/docs/functions/unit-testing) (Firebase docs) is in this blurry middle kingdom.

It might work.

However, the author finds it way clearer to keep `firebase-admin` to the admin side (Cloud Functions run either online, or by the emulator) and client side (including tests) client side.

This means no function unit tests, but integration tests instead.
-->
