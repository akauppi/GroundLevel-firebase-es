# Known Issues

## Deprecated dependency warnings

```
$ npm install
...
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
```

These are addressed by `firebase-tools`, and should go away.


## `npm run test:fns:all` fails

><font color=red>Userdata testing currently disabled.
</font>

```
$ npm run test:fns:all

> test:fns:all
> GCLOUD_PROJECT=bunny NODE_OPTIONS="--experimental-vm-modules --experimental-json-modules" jest --config test-fns/jest.config.js --verbose --detectOpenHandles --all

(node:67098) ExperimentalWarning: VM Modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 FAIL  test-fns/logging.8x.test.js
  Can proxy application logs
    ✕ accepts Cloud Logging log entries (16 ms)

  ● Can proxy application logs › accepts Cloud Logging log entries

    internal
```

- [ ] Gets fixed once userdata management is rewritten (making backend function triggered by authentication).
