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
|`request-promise-native`|`jest-circus@27.0.0-next.2`|
|`har-validator`|`firebase-jest-testing@0.0.2-beta.0`|
|`request`|`firebase-jest-testing@0.0.2-beta.0`, `jest-circus@27.0.0-next.2`|

## Test fails!!

```
$ npm test
...
 FAIL  test-fns/userInfo.test.js
  ● Test suite failed to run

    linking error, not in local cache
```

This needs to be fixed at the `firebase-jest-testing` side (reproducible there).

May be connected to Node v.15.9.0 (but not sure).

Should not affect the larger repo.