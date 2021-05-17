# Track (backend)

## 🍒 Jest: native ES module support

- [Support ESM versions of all pluggable modules](https://github.com/facebook/jest/issues/11167)

  - [ ] `resolver`: when checked, try without the custom resolver in `jest.config.default.js`


## `firebase-functions`: ES module, anyone?

This will need support both from `firebase-functions` (does not offer ES module files; 3.13.1) and the emulator (`firebase-tools` 9.10.2). Trying to launch Cloud Functions expressed as an ECMAScript module stop short:

```
[emul] require() of /Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions/index.js from /usr/local/lib/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
```

While there's no immediate benefit in supporting ECMAScript modules, it becomes less and less reasonable, not to.

- [Support ES Modules for Node 14 functions](https://github.com/firebase/firebase-tools/issues/2994)


## Cloud Functions as a private package

- [Cannot deploy private packages with Node 10](https://github.com/firebase/firebase-functions/issues/607) (firebase-functions)
  
Seems some people are using the `functions` folder as private.

We didn't, but until this is fixed we likely also cannot.

- [ ] keep an eye on. Having `package-lock.json` there is okay.


## `@google-cloud/logging` ESM support

- [es6 import not able to import Logging](https://github.com/googleapis/nodejs-logging/issues/559)

Note: We won't need it, until `firebase-functions` runs with ESM. And even then, node allows using `require` in `type: "module"` packages.
