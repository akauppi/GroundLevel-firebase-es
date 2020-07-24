# Firebase libraries

Firebase has quite many server and client side JavaScript libraries, and their life cycles, quality etc. differ from each other.

Here is a list of the ones we've come across (all authored by Firebase), to help one see their relevance - or lack thereof. 



## Table

>Note: This table is a "best effort" and we aim to edit it, from time to time, when better real world knowledge of the various libraries is gained.

|npm|What is it?|When to use?|Open issues|
|---|---|---|---|
|**Client side**|
|&nbsp;&nbsp;[`firebase`](https://www.npmjs.com/package/firebase)|Main JavaScript client|Browser app or client side node.js (e.g. tests)|[220](https://github.com/firebase/firebase-js-sdk/issues) (23-Jul-20); oldest 18-May-2017; includes `@firebase/testing` issues|
|&nbsp;&nbsp;`@firebase/testing`|Library "..for testing Security Rules with the Realtime Database or Cloud Firestore" (i.e. more limited scope than the the name implies!)|Testing Firestore functionality that needs authentication (e.g. security rules but also integration tests).<br/><br/>Benefits:<ul><li>*"supports mocking auth in Security Rules"*</li><li>*Any database will accept the string `"owner"` as an admin auth token.*</li></ul>Deficiencies:<ul><font color=red><li>Q: do data changes trigger emulated Cloud Functions??</li></font></ul>|Part of the `firebase-js-sdk` repo: `packages/testing`. *No separate issues tracking* <br/><br/>[9](https://github.com/firebase/firebase-js-sdk/issues?q=is%3Aopen+is%3Aissue+label%3Atesting-sdk) (24-Jul-20); oldest 16-May-2019|
|**Between client and server sides (fuzzy and furry) 🦥**|
|&nbsp;&nbsp;`firebase-functions-test`|Tools for making *unit tests* on Cloud Functions.|You want to unit test Cloud Functions within the `functions` folder. We don't use it. Making integration tests against local emulators may be a better approach.|[9](https://github.com/firebase/firebase-functions-test/issues) (23-Jul-20); oldest 8-Apr-2018|
|**Server side**|
|&nbsp;&nbsp;`firebase-admin`|Access to Firebase data, when running in a server-side node environment (locally emulated or online)|Don't use this client side.|[33](https://github.com/firebase/firebase-admin-node/issues) (23-Jul-20); oldest 7-Jun-2017|
|&nbsp;&nbsp;`firebase-functions`|A library needed for implementing Cloud Functions||[30](https://github.com/firebase/firebase-functions/issues) (23-Jul-20); oldest 19-Jun-2018|
|**Developer tools**|
|&nbsp;&nbsp;`firebase-tools`|Command Line Interface (CLI)|Development and deployment; launching emulators. You need it.|[146](https://github.com/firebase/firebase-tools/issues) (23-Jul-20); oldest 16-Dec-2015|

Note: There are also other, non-official packages that are not deployed by Firebase. **Stay clear of those!** It would be a good phishing attempt to make something people would install, by accident. **DO NOT TRUST THE NAMES**. It would be welcome if Firebase brought **all** their `npm` modules under the `@firebase` namespace, for simplifying this.

Why list the oldest issues?

Having old (say, over 6 months) issues in a repo is unmotivating for employees and causes a jungle of discussions to browse through for visitors. A healthy repo would have relatively fast turn-around times, issues being assigned to milestones or resolved as "nah, we won't do that".

Tracking a project's energy and roadmap is easier when old issues are not standing in the way.

That's why they are listed. Once they are <1 year in the past, we'll remove the listing. 

🧹

### Where does the confusion rise from??

Entries like [this](https://stackoverflow.com/questions/62566957/cannot-call-firestore-from-unit-tests/62586875#62586875) show the "admin" library being used with tests (not run as a privileged environment, but just from the development environment command line).

Also [Unit testing of Cloud Functions](https://firebase.google.com/docs/functions/unit-testing) (Firebase docs) is in this blurry middle kingdom.

It might work.

However, the author finds it way clearer to keep `firebase-admin` to the admin side (Cloud Functions run either online, or by the emulator) and client side (including tests) client side.

This means no function unit tests, but integration tests instead.


