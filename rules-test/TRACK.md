# Track

## firebase-js-sdk #2895

- [FR: Immutability when testing Firestore Security Rules](https://github.com/firebase/firebase-js-sdk/issues/2895) 
   - let's see what Firebase authors reply
		- no reply in 3 months #sniff 😢
   
## Jest: support for native ES modules

[https://github.com/facebook/jest/issues/9430](https://github.com/facebook/jest/issues/9430)

Looks splendid!

- [ ] Need `globalSetup` to be supported. Currently:

```
$ npm run test3
...
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /Users/asko/Git/GroundLevel-es6-firebase-web.2/rules-test/setup.jest.js
require() of ES modules is not supported.
require() of /Users/asko/Git/GroundLevel-es6-firebase-web.2/rules-test/setup.jest.js from /Users/asko/Git/GroundLevel-es6-firebase-web.2/rules-test/node_modules/@jest/transform/build/ScriptTransformer.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
...
```

- [ ] `--experimental-vm-modules` may no longer be needed. "So saying ESM is unflagged is a bit of a misnomer at the moment".
   - If not, check which Node version is enough and update `engine` field.

- [ ] Is Babel needed for TypeScript use?  Would be nice to keep possibility of using TypeScript.
   


   