# Todo

## Tests

- [ ] Add tests

<!--
  - Coming to the site with a URL path, going through sign-in, one should land in the original intended path.
-->

## WebStorm IDE

*Note: this is not really in the project scope. The author just happens to be using WebStorm.*

- Is confused about the `@/...` routing we've done using `@rollup/plugin-alias`.  (and maybe via Vite when it supports it)

   How to tell it that these paths do exist?

   Track -> https://stackoverflow.com/questions/38440538/how-to-tell-webstorm-a-module-is-installed

   - [ ] Alert IntelliJ to this. It behaves like [this issue from 2016](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207304095-Using-ES6-import-and-node-modules-are-marked-as-Module-is-not-installed-) but is likely different.


## deployment

- [ ] Change the Firebase project name so URL is no longer: `https://vue-rollup-example.firebaseapp.com`.


## Firebase Functions

- Consider making a cloud function that periodically looks for projects that were removed a certain time ago (e.g. > 1 month), and completely removes them. (of course making notes to the log)

## Narrative as the Wiki

Move narrative documents (why we do things in certain way) to the Wiki. 

Make it a walk-through or bisection of the project, leaving project itself uncluttered. :)

- *Vital ingredients*: what tools/libraries we picked and why


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


## Bootcamp 4.5

Bootcamp has great docs and version 5 is no longer dependent on jQuery. We'll use it as our make-up layer.

- [ ] Start section in the Wiki, describing why this


## Firebase UI - or not???

There's an unnecessary re-rendering of the SignUp page, when using Google sign-in with Firebase UI.

Why does that exist?

We likely need to read the Firebase UI code base. And if we do, doing the same as part of `SignIn.vue` might become a tempting idea.

FirebaseUI is just a veneer on top of Firebase auth. If we are better off without it, why not?


## Upgrading an anonymous user

How is that done?  Should we have a menu item if a user has logged in, anonymously?

See [Convert an anonymous account to a permanent account](https://firebase.google.com/docs/auth/web/anonymous-auth#convert-an-anonymous-account-to-a-permanent-account) (Firebase docs)


## Firebase from `npm`

There is no real reason to get Firebase (and Firebase UI) via `index.html`. 

For tracking updates, moving it to `npm` may make sense.

- See https://www.npmjs.com/package/firebase

Note: There is no real downside in the way we are now bringing the modules from CDN.

Edit: One benefit would be that the IDE starts showing implementation of the Firebase functions (`Cmd-B` works in IntelliJ).


## A fade/transition at signout

It's now a bit too fast. 


## Sentry integration

Once their [Vue integration](https://docs.sentry.io/platforms/javascript/vue/) becomes available to Vue 3 (beta), move to it.

