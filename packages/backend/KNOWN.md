# Known Issues

## Deprecated dependency warnings

```
$ npm install
...
npm WARN deprecated request-promise-native@1.0.9: request-promise-native has been deprecated because it extends the now deprecated request package, see https://github.com/request/request/issues/3142
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
```

These come from (used `npm list`):

||caused by|
|---|---|
|`request` `request-promise-native`|`jest@27.0.0-next.9` (via `jsdom@16.5.3`)|
|`har-validator`|via `request`|


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
