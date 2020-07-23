# Firebase libraries

Firebase has quite many server and client side JavaScript libraries, and their life cycles, quality etc. differ from each other.

Here is a list of the ones we've come across (all authored by Firebase), to help one see their relevance - or lack thereof. 



## Table

>Note: This table is a "best effort" and we aim to edit it, from time to time, when better real world knowledge of the various libraries is gained.

|npm|What is it?|When to use?|
|---|---|---|
|**Client side**|
|&nbsp;&nbsp;[`firebase`](https://www.npmjs.com/package/firebase)|Main JavaScript client|Browser app or client side node.js (e.g. tests)|
|&nbsp;&nbsp;`@firebase/testing`|<font color=red>Q: Is this only for Firestore??</font>||
|&nbsp;&nbsp;`firebase-functions-test`|Tools for making unit tests on Cloud Functions|You might not need it (we don't use it). Making integration tests against local emulators may be a better approach.|
|**Server side**|
|&nbsp;&nbsp;`firebase-admin`|Access to Firebase data, when running in a server-side node environment (locally emulated or online)|Don't use this client side.|
|&nbsp;&nbsp;`firebase-functions`|A library needed for implementing Cloud Functions||
|**Developer tools**|
|&nbsp;&nbsp;`firebase-tools`|Command Line Interface (CLI)|Development and deployment; launching emulators. You need it.|

Note: There are also other, non-official packages that are not deployed by Firebase. **Stay clear of those!** It would be a good phishing attempt to make something people would install, by accident. **DO NOT TRUST THE NAMES**. It would be welcome if Firebase brought **all** their `npm` modules under the `@firebase` namespace, for simplifying this.

