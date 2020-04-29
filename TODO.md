# Todo

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

- Is confused about the `@/...` routing we've done using `@rollup/plugin-alias`.  (and maybe via Vite when it supports it)

   How to tell it that these paths do exist?

   Track -> https://stackoverflow.com/questions/38440538/how-to-tell-webstorm-a-module-is-installed

   - [ ] Alert IntelliJ to this. It behaves like [this issue from 2016](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207304095-Using-ES6-import-and-node-modules-are-marked-as-Module-is-not-installed-) but is likely different.


## rollup-plugin-vue

- Not able to do dynamic imports in `src/routes.js`.

   The [sample code](https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication/blob/master/src/router/index.js#L15) does it. Difference is we're using `rollup-plugin-vue` (or something else??).

   Track -> https://github.com/vuejs/rollup-plugin-vue/issues/328


## deployment

- [ ] Change the Firebase project name so URL is no longer: `https://vue-rollup-example.firebaseapp.com`.


## Firebase

- Would someone with more Firebase experience check out the instructions in `README.md`. #help


## Vue 3 beta

Once it reaches beta, let's make a `vue3-beta` branch that uses them (Vue + vue-router). Many things how it can simplify code:

- allows multiple root nodes in a `template`
- use of `ref` to have any values reactive


## Font Awesome

- [ ] Consider bringing it in, to replace e.g. the menu down-arrow with an icon from `npm`. 

   See https://github.com/FortAwesome/vue-fontawesome

## Firebase Functions

- Consider making a cloud function that periodically looks for projects that were removed a certain time ago (e.g. > 1 month), and completely removes them. (of course making notes to the log)

## Narrative as the Wiki

Move narrative documents (why we do things in certain way) to the Wiki. 

Make it a walk-through or bisection of the project, leaving project itself uncluttered. :)

- *Vital ingredients*: what tools/libraries we picked and why



## Rollup update

Check out 2.0.3 once plugins are available for it:

```
$ npm install
...
npm WARN @rollup/plugin-alias@3.0.1 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
npm WARN @rollup/plugin-node-resolve@7.1.1 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
npm WARN @rollup/pluginutils@3.0.8 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
npm WARN rollup-plugin-livereload@1.0.4 requires a peer of rollup@^1.0.0 but none is installed. You must install peer dependencies yourself.
```

Also check breaking changes: [CHANGELOG](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#breaking-changes) 

 #help


## Is 'template functional' still a thing in Vue.js 3?

If it is, let's see where it fits in.

If it's not, let's not bother.

- It's largely a dual syntax
- Compiler doesn't seem to figure out when it has been misused (Vue.js 2.6.11)


## Source map for console errors

The errors now point to the bundle (Safari, Chrome). Can we make them point to the source, instead? #help

Edit: This may be a Rollup thing, fixed in 2.0.x

>Generate correct sourcemaps when tree-shaking occurs in a multi-file bundle (#3423)

- [ ] Update to Rollup 2.x and test the sourcemaps


## Wiki about design of data modeling (document or collection)

<!-- tbd. move this analysis somewhere else, maybe Wiki? Make it GOOD!

Add:
- fields needed in Security Rules are best to be in the same document (each document read costs for access)
- how often does the data (need to) change?  Change to an auxiliary field (e.g. 'lastSeen') triggers updates to anyone following the document.
- do the fields contribute to another (parent) document's Security Rules? If not, they may be okay as a subcollection. (this was already mentioned, in other words)
...

<<
With Cloud Firestore, design of data schemas is steered by these considerations:

To go in-document:

- **Billing:** access is charged per document. Avoid sub-collections unless they are really required.


To go sub-collection:

- **Access:** you cannot restrict reading of individual fields &mdash; documents are either fully available or not at all. You can restrict write access to individual fields.
- **Security rules:** you cannot use in-document arrays as part of security rule logic ("allow if `uid` is found within the `authors`"). You can express this with sub-collections.
- **Document size:** Documents must fit 1MB - 89 bytes. If you think they might grow larger, split something to sub-collections.

>Do you know more guidance for steering database schema design in Firestore? Please share the info at [Gitter](https://gitter.im/akauppi/GroundLevel-firebase-web) or as a PR. 📝🙂
<<
-->

## Security Rules

Changes due to the invite workflow: Cloud Functions should be the one bringing new users to `collaborators` and/or `authors`. This should be reflected in the docs, security rules, and their tests.


## When Vite allows path mapping

- [ ] Place `@/` back as a route to source level, not needing `./`, `../`.

It kind of *does*. Evan published an "API" and it allows before/after filters.  We can use that for the mapping.

Also:

- `import ... from "blah"` -> `import ... from "blah.js"`

