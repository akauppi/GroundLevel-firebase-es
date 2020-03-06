# TODO

## `start-server-and-test` not detecting when the server is up

Don't know why. 

Expected:

- `npm testB` should run the tests (similar to 'A' variant)

Actual:

- `npm testB` remains waiting for `http://localhost:6767` to come up, indefinitely (well, some minutes). It shouldn't.

OS: macOS 10.15.3

Not a major thing, since the commands themselves work. If you know how to solve it, please send a PR. 😀🎁


## Something keeps the port taken

After some tests, this will happen:

```
 FAIL  ./no-access.test.js
  Rules with no access
    ✕ fail when reading/writing an unauthorized collection (1ms)
    ✕ reading of /abc/{id} should succeed (1ms)
    ✕ writing to /abc should NOT succeed

  ● Rules with no access › fail when reading/writing an unauthorized collection

    14 UNAVAILABLE: failed to connect to all addresses

      at Object.<anonymous>.exports.createStatusError (node_modules/grpc/src/common.js:91:15)
      at Object.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:1209:28)
      at InterceptingListener.Object.<anonymous>.InterceptingListener._callNext (node_modules/grpc/src/client_interceptors.js:568:42)
      at InterceptingListener.Object.<anonymous>.InterceptingListener.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:618:8)
      at callback (node_modules/grpc/src/client_interceptors.js:847:24)
```

Something is keeping a port open. Please help us add suitable cleanup to the tests, or otherwise get rid of this.

Restart of the computer does help - but is overkill.

>Note: Also waiting some minutes seems to cure this (at least once!)


