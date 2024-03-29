# Known issues


## Browser window is all empty

If, after `npm run dev`, there's nothing in the browser and the console shows:

`Unable to load module .. app.js`

..or something, nothing's necessarily wrong.

**Remedy #1**

Clear cache, refresh the browser.

**Remedy #2**

Try with multiple browsers. E.g. Chrome may give more debugging information than Safari.


## Priming fails with: `socket hang up. Error code: ECONNRESET` 

Created [#104](https://github.com/akauppi/GroundLevel-firebase-es/issues/104) to track this.

*Still having this, on Windows 10 + WSL (13-Jul-2022)* 

*Also on macOS /28-Jul-2022*

```
$ npm test
...
Firebase Emulators for the web app are running.

make: Nothing to be done for 'refresh-prime'.
[+] Running 1/1
 ⠿ Network app_default  Created                                                                                                                                                                                   0.1s
/work/node_modules/firebase-admin/lib/utils/api-request.js:178
            throw new error_1.FirebaseAppError(error_1.AppErrorCodes.NETWORK_ERROR, `Error while making request: ${err.message}. Error code: ${err.code}`);
                  ^

FirebaseAppError: Error while making request: socket hang up. Error code: ECONNRESET
    at /work/node_modules/firebase-admin/lib/utils/api-request.js:178:19
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
```

>Can also happen with `npm run dev`.

If you encounter this, just retry.

The reason is unknown. 


## `ERROR:gpu_memory_buffer_support_x11.cc [...] dri3 extension not supported`

..when running `make test`.

```
[192:1004/121659.646969:ERROR:gpu_memory_buffer_support_x11.cc(44)] dri3 extension not supported.
```

You can ignore this line. It's likely connected with Chrome (and headed mode, not headless). Does not affect us.


## Warnings in `make test` output

```
[2022-10-05T15:07:25.368Z]  @firebase/database: FIREBASE WARNING: Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ".indexOn": "ctx/clientTimestamp" at /incoming/incs to your security rules for better performance. 
```

The `../backend/database.rules.app.json` file should have appropriate indexing, but emulators don't seem to load it.

**This warning can be ignored.**


## First `make test` fails

```
$ make test
...
1) Central metrics, logs and samples end up in Realtime Database (when a user has signed in)
       Have metrics passed to Realtime Database:
     CypressError: `cy.task('getIncoming')` timed out after waiting `15000ms`.
```

Not sure, why.

Just retry, and they should pass.


## Firefox: warning with `make dev`

Firefox 107-108 don't support ES modules from a worker constructed with `Worker()`.

Vite (3.2.2) docs say this:

>The worker script can also use `import` statements instead of `importScripts()` - note during dev this relies on browser native support and currently only works in Chrome, but for the production build it is compiled away. <sub>[source](https://vitejs.dev/guide/features.html#web-workers)</sub>


**Situation in Nov'22** (Vite 3.2.2.)

||console output|workers&nbsp;ship|
|---|---|---|
|Chrome&nbsp;107|(nothing)|yes &check;|
|Safari&nbsp;16.1|(nothing)|yes &check;|
|Firefox&nbsp;106|`SyntaxError: import declarations may only appear at top level of a module`|no|
|Edge|not tried|

This could be fixed by using traditional (non-ES) web workers, but the author's not taking that route, unless the severity of this is shown..

- We might not need workers, after all? (depends on Grafana Cloud)
- This might (likely does?) only affect development, not production?
  - [ ] check the above (load deployed site with Firefox)

Here's the [caniuse](https://caniuse.com/mdn-api_worker_worker_ecmascript_modules).

>Note: Vite may compile this out, in production builds. In that case, we just don't support using Firefox in development.
