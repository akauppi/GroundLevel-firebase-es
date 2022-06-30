# Known issues


## Cannot see a thing

If, after `npm run dev`, there's nothing in the browser and the console shows:

`Unable to load module .. app.js`

..or something, nothing's necessarily wrong.

**Remedy #1**

Clear cache, refresh the browser.

**Remedy #2**

Try with multiple browsers. E.g. Chrome may give more debugging information than Safari.


## First `npm test` times out

```
$ npm test
...

 1) Sign In as Joe
       See one's name:
     AssertionError: Timed out retrying after 10000ms: Expected to find content: 'Joe D.' within the element: <div#user-name> but never did.
      at Context.eval (http://localhost:3000/__cypress/tests?p=cypress/joe/signInAs.spec.js:114:35)

```

This happens on the *first* test run (when DC containers are created). Reason is unknown - adding to the timeout did not help.

Docker Desktop for Mac 4.0.1

<!-- tbd. Do we still get it? DD 4.8 -->

**Work-around:**

Run the tests a second time.

This does not hinder CI runs (which is fortunate).


## `ECONNRESET` failure

```
$ npm run dev

> dev
> npm run dev:local


> dev:local
> npm run -s _checkNoEsBuild && npm run -s _emulPrimed && npm run -s _genEnvLocal && docker compose down vite-local && docker compose run --rm --service-ports vite-local

WARN[0000] Found orphan containers ([backend-warm-up-1 backend-emul-1]) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up. 
[+] Running 1/1
 ⠿ Container backend-emul-for-app-1  Created                                                                                                                                                                                                             0.1s
[+] Running 2/2
 ⠿ Container backend-emul-for-app-1  Started                                                                                                                                                                                                             1.0s
 ⠿ Container backend-emul-1          Healthy                                                                                                                                                                                                             0.9s
Firebase Emulators for the web app are running.

/work/node_modules/firebase-admin/lib/utils/error.js:44
        var _this = _super.call(this, errorInfo.message) || this;
                           ^

FirebaseAppError: Error while making request: socket hang up. Error code: ECONNRESET
    at FirebaseAppError.FirebaseError [as constructor] (/work/node_modules/firebase-admin/lib/utils/error.js:44:28)
    at FirebaseAppError.PrefixedFirebaseError [as constructor] (/work/node_modules/firebase-admin/lib/utils/error.js:90:28)
    at new FirebaseAppError (/work/node_modules/firebase-admin/lib/utils/error.js:125:28)
    at /work/node_modules/firebase-admin/lib/utils/api-request.js:211:19
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async wipeUsers (file:///work/src/createUsers/index.js:50:15)
    at async Promise.all (index 1)
    at async main (file:///work/src/main.js:24:3) {
  errorInfo: {
    code: 'app/network-error',
    message: 'Error while making request: socket hang up. Error code: ECONNRESET'
  },
  codePrefix: 'app'
}

Node.js v18.1.0
```

If you encounter this, just retry `npm run dev`.

The reason is unknown. 

- [ ] Make a GitHub Issue and try to resolve.
