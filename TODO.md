# Todo

<!-- disabled
## WebStorm IDE

*Note: this is not really in the project scope. The author just happens to be using WebStorm.*

- Is confused about the `@/...` routing we've done using `@rollup/plugin-alias`.  (and maybe via Vite when it supports it)

   How to tell it that these paths do exist?

   Track -> https://stackoverflow.com/questions/38440538/how-to-tell-webstorm-a-module-is-installed

   - [ ] Alert IntelliJ to this. It behaves like [this issue from 2016](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207304095-Using-ES6-import-and-node-modules-are-marked-as-Module-is-not-installed-) but is likely different.
-->

## deployment

- [ ] Change the Firebase project name so URL is no longer: `https://vue-rollup-example.firebaseapp.com`.


## Firebase Functions

- Consider making a cloud function that periodically looks for projects that were removed a certain time ago (e.g. > 1 month), and completely removes them. (of course making notes to the log)

## <strike>Narrative as the Wiki

Move narrative documents (why we do things in certain way) to the Wiki. 

Make it a walk-through or bisection of the project, leaving project itself uncluttered. :)

- *Vital ingredients*: what tools/libraries we picked and why</strike>


## Security Rules

Changes due to the invite workflow: Cloud Functions should be the one bringing new users to `members` and/or `authors`. This should be reflected in the docs, security rules, and their tests.


## When Vite allows path mapping

- [ ] Place `@/` back as a route to source level, not needing `./`, `../`.

It kind of *does*. Evan published an "API" and it allows before/after filters.  We can use that for the mapping.

Also:

- `import ... from "blah"` -> `import ... from "blah.js"`


## Upgrading an anonymous user

How is that done?  Should we have a menu item if a user has logged in, anonymously?

See [Convert an anonymous account to a permanent account](https://firebase.google.com/docs/auth/web/anonymous-auth#convert-an-anonymous-account-to-a-permanent-account) (Firebase docs)


## A fade/transition at signout

It's now a bit too fast. 


## README: mention production project

Discuss in suitable place about using just one project, or separate staging/production.


## Re-implement auth flow as Vue 3 component

Firebase UI is not as great as it could.

As part of debugging the auth flow, we might end up just studying the source code and implementing necessary pieces again, as a Vue 3 component.

It just doesn't seem to have the same quality and clarity of documentation as the other components we use.

<!-- tbd. list here actual shortcomings we have -->

**Shortcomings experienced:**

- Not fully ES module compatible
- Has [over 100 Issues open](https://github.com/firebase/firebaseui-web/issues)
- Could use promises
- ...

While it makes sense to have a centralized library to "do auth right", this one is getting out of hand as to the number of features - and not getting enough care at the same time. By focusing on a smaller feature set, and not needing to be generic web (i.e. we can be ES6 and Vue 3 specific), we likely will be able to do a better job.


## Hot reloading also for `npm run serve`

Seems this should now be possible (Rollup [2.29.0](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#2290)).

- Study how it's done
- Try out

If nothing else, using watch also for `npm run serve` would be consistent with `dev`. Matters most when the `init` code is developed.

