# Track (backend)

## Jest: native ES module support

- In StackOverflow: [https://stackoverflow.com/questions/60372790/node-v13-jest-es6-native-support-for-modules-without-babel-or-esm](https://stackoverflow.com/questions/60372790/node-v13-jest-es6-native-support-for-modules-without-babel-or-esm)

  - [ ] write a solution if we get one

- In Jest GitHub Issues: [#9430](https://github.com/facebook/jest/issues/9430)
  - has a useful per-subfeature list about the support

   Note especially (not supported): 
   
   - "Detect if a file is supposed to be ESM or CJS mode"
   

---

Situation with `2.0.0-next.2`:

The support is not quite there (tried, briefly).

However, experiment in `firebase-jest-testing` since we'd *anyways* need to import it. Build from there up.

---

## `firebase-functions`: ES module, anyone?

This will need support both from `firebase-functions` (does not offer ES module files; 3.13.1) and the emulator (`firebase-tools` 9.2.2). Trying to launch Cloud Functions expressed as an EcmaScript module stop short:

```
[emul] require() of /Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions/index.js from /usr/local/lib/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
```

Note: Cloud Functions now supports Node v.14, which makes running native ECMAScript modules possible. Firebase JavaScript SDK provides those files (unrelated to the server issue).

= While there's no immediate benefit in supporting ECMAScript modules, it becomes less and less reasonable, not to.

27-Jan-2021

- [Support ES Modules for Node 14 functions](https://github.com/firebase/firebase-tools/issues/2994)


## Cloud Functions as a private package

- [Cannot deploy private packages with Node 10](https://github.com/firebase/firebase-functions/issues/607) (firebase-functions)
  
Seems some people are using the `functions` folder as private.

We didn't, but until this is fixed we likely also cannot.

- [ ] keep an eye on. Having `package-lock.json` there is okay.


## `@google-cloud/logging` ESM support

- [es6 import not able to import Logging](https://github.com/googleapis/nodejs-logging/issues/559)

Note: We won't need it, until `firebase-functions` runs with ESM. And even then, node allows using `require` in `type: "module"` packages.
