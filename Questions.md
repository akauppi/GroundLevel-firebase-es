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


## Can we import Firebase from `@firebase/app`, directly?

The official [npm page](https://www.npmjs.com/package/firebase) shows this use pattern (for ES modules):

```
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
```

However, the `firebase` imports internally import from `@firebase`. This would work also for us, but we are not doing it since it’s not according to documentation.

Q: Is Firebase moving to that direction (@firebase), or is the current vaneer going to remain?

This is not a problem. `npm run build` outputs two different bundles, because of the two namespaces, but we solve this in chunk merging.


## Does Vue.js 3 have a corresponding thing to `renderError`?

Vue.js 2 had this this - what's a similar way with Vue 3 (beta)? Do we need this?

```
  renderError: (h, err) => {  // pour runtime problems on the screen, if we have them (may help in development);
                              // in production we may want to pour these to central monitoring
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
```

