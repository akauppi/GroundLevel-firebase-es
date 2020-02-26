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


- Syntax highlighter for Firebase storage rules

   - [StackOverflow](https://stackoverflow.com/questions/59999967/is-there-a-firebase-storage-rules-syntax-highlighter-for-webstorm)
   - [IntelliJ WebStorm backlog](https://youtrack.jetbrains.com/issue/IDEABKL-7927?p=IDEA-200507)

   
   
## rollup-plugin-vue

- Not able to do dynamic imports in `src/routes.js`.

   The [sample code](https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication/blob/master/src/router/index.js#L15) does it. Difference is we're using `rollup-plugin-vue` (or something else??).

   Track -> https://github.com/vuejs/rollup-plugin-vue/issues/328


## deployment

- [ ] Change the Firebase project name so URL is no longer: `https://vue-rollup-example.firebaseapp.com`.


## Firebase

- What is the difference between `firebase init` and `firebase use --add`? 

   Could someone with more Firebase experience check out the instructions in `README.md` and `DEVS/Setting up the Firebase project.md`. #help


## Vue 3 beta

Once it reaches beta, let's make a `vue3-beta` branch that uses them (Vue + vue-router). Many things how it can simplify code:

- allows multiple root nodes in a `template`
- use of `ref` to have any values reactive

( ) When we do this, let's take them via `npm` dependencies (not CDN link). Vue 3 is better suited to tree-shaking.


## Font Awesome

- [ ] Consider bringing it in, to replace e.g. the menu down-arrow with an icon from `npm`. 

   See https://github.com/FortAwesome/vue-fontawesome
