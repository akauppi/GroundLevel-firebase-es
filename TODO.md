# Todo

## Authentication

- [ ] Add Apple auth. See [extra information](https://firebase.google.com/docs/auth/web/apple?authuser=0)
  - maybe not. Requires an Apple developer account ($99/year); Contributions welcome from people who have it. #help


## Tests

- [ ] Add tests

<!--
  - Coming to the site with a URL path, going through sign-in, one should land in the original intended path.
-->

## Firebaseui

- [ ] It should depend directly on `@firebase/app` and `@firebase/auth`, instead of `firebase` - as it now does.
  - [ ] Track this (link here, if none, make one)

  - Only applies to `npm`. We are currently getting Firebase and FirebaseUI from CDN in `index.html`.

## WebStorm IDE

*Note: this is not really in the project scope. The author just happens to be using WebStorm.*

- "Module is not installed" in the IDE
 
   WebStorm 2019.3 is confused about where `Vue` and `VueRouter` are coming from.

   ```
   import Vue from 'vue';    // ignore IDE warning "Module is not installed" (Q: how to disable the warning in WebStorm?) #help
   
   import VueRouter from 'vue-router';
   ```

   Separately, it's also confused about the `@/...` routing we've done using `@rollup/plugin-alias`.

   How to tell it that these paths do exist?

   Track -> https://stackoverflow.com/questions/38440538/how-to-tell-webstorm-a-module-is-installed

   - [ ] Alert IntelliJ to this. It behaves like [this issue from 2016](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207304095-Using-ES6-import-and-node-modules-are-marked-as-Module-is-not-installed-) but is likely different.


- "Contents are identical" between source and `bundle.esm.js`

   For some reason, WebStorm thinks it's a good idea to compare `public/bundle.ems.js` with our source files. It should know that it's an output file, by a) `.gitignore`, b) Rollup config.
   
   Folders can be marked as output/ignore, but what about a single file?  If this hurts, we can change the output to be a directory (`public/dist`).   
   
   
## rollup-plugin-vue

- Not able to do dynamic imports in `src/routes.js`.

   The [sample code](https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication/blob/master/src/router/index.js#L15) does it. Difference is we're using `rollup-plugin-vue` (or something else??).

   Track -> https://github.com/vuejs/rollup-plugin-vue/issues/328


## deployment

- [ ] Change the Firebase project name so URL is no longer: `https://vue-rollup-example.firebaseapp.com`.



