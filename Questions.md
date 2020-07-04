# Qs

## What about IE11 support?

It doesn't support ES6 modules. If you need IE11 support, it's fairly easily doable.

- Check out [@rollup/plugin-buble](https://github.com/rollup/plugins/tree/master/packages/buble) and take it to use
- Change the Rollup output format from `esm` to e.g. `iife`

You may need to experiment. Once done - and if you wish to maintain the work - it could be incorperated as an `ie11` branch.

The reason this is not default is just avoiding any complexity. The template aims to be slender and smooth.


## Firestore

### Is it better to name document keys `last-used` or `lastUsed`?

Which is more customary, in Firestore?


## Importing Firebase

The official [npm page](https://www.npmjs.com/package/firebase) shows this use pattern (for ES modules):

```
import * as firebase from 'firebase/app';
 
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';
```

However, the `firebase` imports internally import from `@firebase`. 

Would it be safe (supported) to import directly as `@firebase/app` (it does work).

Is this a problem? Not really. `npm run build` outputs two different bundles, because of the two namespaces. But if Firebase is aiming towards the `@firebase` for ES module imports, could just as well move there now. 

Note: we solve this in chunk merging, to make just one output bundle for both Firebase namespaces.

