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
