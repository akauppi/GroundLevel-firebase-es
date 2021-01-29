# Known Issues

## Warnings at `npm install`

```
$ npm install
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: undefined,
npm WARN EBADENGINE   required: { node: '14' },
npm WARN EBADENGINE   current: { node: 'v15.5.0', npm: '7.3.0' }
npm WARN EBADENGINE }
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: undefined,
npm WARN EBADENGINE   required: { node: '14' },
npm WARN EBADENGINE   current: { node: 'v15.5.0', npm: '7.3.0' }
npm WARN EBADENGINE }
...
```

If you know how these can be mitigated, please do. `#help` 

## Deprecated dependency warnings

```
$ npm install
...
npm WARN deprecated request-promise-native@1.0.9: request-promise-native has been deprecated because it extends the now deprecated request package, see https://github.com/request/request/issues/3142
npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
```

These come from (used `npm list`):

||caused by|
|---|---|
|`request-promise-native`|`jest-circus@26.6.3`|
|`urix`|`jest-circus@26.6.3`|
|`har-validator`|`firebase-jest-testing@0.0.1-beta.3`|
|`resolve-url`|`jest-circus@26.6.3`|
|`request`|`firebase-jest-testing@0.0.1-beta.3`, `jest-circus@26.6.3`|

