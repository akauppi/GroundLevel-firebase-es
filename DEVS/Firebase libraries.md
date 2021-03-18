# Firebase libraries

Firebase has quite many server and client side JavaScript libraries, and their life cycles, quality etc. differ from each other.

Firebase seems to be wanting to clarify this and e.g. renamed `@firebase/testing` as `@firebase/rules-unit-testing` in Aug 2020, which does better convey its purpose.

Here is a list of the ones we've come across (all authored by Firebase), to help one see their relevance.



## Table

>Note: This table is a "best effort" and we aim to edit it, from time to time.

If we are really friendly, we'd set up an automatic page to log the trends of the GitHub issue counts.

||What is it?|When to use?|Open issues|
|---|---|---|---|
|**Client side**|
|&nbsp;&nbsp;`firebase`|JavaScript SDK|Browser app or client side node.js (applies Security Rules)|[302](https://github.com/firebase/firebase-js-sdk/issues) <!-- was: 249, 220 --> (17-Mar-21); oldest 18-May-2017; includes `@firebase/testing` (deprecated) and `@firebase/rules-unit-testing` issues|
|&nbsp;&nbsp;`firebaseui-web` <small>Note: We don't use it</small>|Authentication UI for web|Complex authentication flows (\*)|[124](https://github.com/firebase/firebaseui-web/issues) <!--was: 114,109--> (17-Mar-21); oldest 18-May-2017|
|**Server side**|
|&nbsp;&nbsp;`firebase-admin`|Access to Firebase data, bypassing Security Rules|Declaring Cloud Functions; Tests against an emulator; Priming data; Not for the browser|[43](https://github.com/firebase/firebase-admin-node/issues) <!-- was: 42,36 --> (17-Mar-21); oldest 7-Jun-2017|
|&nbsp;&nbsp;`firebase-functions`|A library needed for implementing Cloud Functions||[51](https://github.com/firebase/firebase-functions/issues) <!-- was: 54,35 --> (17-Mar-21); oldest 19-Jun-2018|
|**Testing libraries**|
|&nbsp;&nbsp;`@firebase/rules-unit-testing` <small>Note: We don't use it directly, but via `firebase-jest-testing`</small>|".. for testing Security Rules with the Realtime Database or Cloud Firestore emulators".|Testing Security Rules<br/><br/>Benefits:<ul><li>*"supports mocking auth"*</li><li>*Any database will accept the string `"owner"` as an admin auth token.*</li></ul>|Part of the `firebase-js-sdk` repo: `packages/rules-unit-testing`. *No separate issues tracking* <br/><br/>[15](https://github.com/firebase/firebase-js-sdk/issues?q=is%3Aopen+is%3Aissue+label%3Atesting-sdk) <!-- was: 12,8 --> (17-Mar-21); oldest 16-May-2019|
|&nbsp;&nbsp;`firebase-functions-test` <small>Note: We don't use it.</small>|Tools for making *unit tests* on Cloud Functions.|Unit testing Cloud Functions within the `functions` folder.|[18](https://github.com/firebase/firebase-functions-test/issues) <!-- was: 11,9 --> (17-Mar-20); oldest 8-Apr-2018|
|**Developer tools**|
|&nbsp;&nbsp;`firebase-tools`|Command Line Interface (CLI)|Development and deployment; Launching emulators. You need it.|[218](https://github.com/firebase/firebase-tools/issues) <!-- was: 179,146 --> (17-Mar-21); oldest 16-Dec-2015|
|**Deprecated**|
|`@firebase/testing` -> `@firebase/rules-unit-testing`|Security Rules testing, until Aug 2020.|

There are also other, non-official packages that are *not* deployed by Firebase. **Be careful of those!**. It would be a good phishing attempt to make something people would install, by accident. **DO NOT TRUST THE NAMES**.


*(\*): We don't use `firebaseui-web`. In fact, we cannot since it's not compatible with the "alpha" Firebase APIs. [aside-keys](https://www.npmjs.com/package/aside-keys) is, but offers only limited authentication provider support.*


### Why list the oldest issues?

Having old (say, over 6 months) issues in a repo is unmotivating for employees and users alike. It leaves a jungle of discussions to browse, much of it has become irrelevant. A healthy repo would have relatively few long-lasting issues, fast turn-around times, and new issues easily marked as "nah, we won't do that".

Community engagement is easier with a well groomed repo. For example building a repo (and running its tests) should be very, very easy. I'm afraid it's not at the moment. This all leads to cruft, confusion, anxiety and *.

That's why they are listed. Once the trends show the numbers are diminishing and the oldest issues are <1 year old, the author will remove the listing. 

<font size="9">🧹🧹🧹🧹🧹🧹🧹🧹🧹🧹🧹🧽🪣🧼</font>

