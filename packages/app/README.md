# App

Web application sample project.

## Requirements

- `npm`
- `firebase-tools`

   ```
   $ npm install -g firebase-tools
   ```

Installing [Cypress](https://www.cypress.io) is left optional, since it's 
a big install and one can play with the repo even without it. 

The test section discusses it more.

<!--
Development is done with: 

- latest macOS (11.1)
- latest node (15.5.0)
- npm (7.5.x)
- firebase CLI (9.3.0)
-->

## Getting started

```
$ CYPRESS_INSTALL_BINARY=0 npm install
```

>Note: The `CYPRESS_INSTALL_BINARY=0` speeds up the install by skipping downloading the binary part of Cypress. It's only needed for running tests - we'll get back to it.

Launch the app:

```
$ npm run dev
...
[init]   Vite dev server running at:
[init]
[init]   > Local:    http://localhost:3000/
[init]   > Network:  http://192.168.1.62:3000/
[init]
...
```

This serves the UI locally, against an emulated Firebase back-end, with Security Rules applied.

Authentication is not included in this "local" mode. Instead, you provide the user name as a query parameter. Try it out:

[http://localhost:3000?user=dev](http://localhost:3000?user=dev)

<!-- (future me: can I make any sense of this??)

Tests use the same server and there are tests for the sign-in, so we didn't want to just automatically sign you in. Now you know. Now, you can forget..
-->

Try making some changes in the `src/**` files and see that they are reflected in the browser.

---

### Deeper background

The code is served by [Vite](https://github.com/vitejs/vite) which is a great development tool for front ends. It does the magic of Hot Module Reload and supports ES Modules.

We *love* ES modules. :) This whole project started as the author's exercise on whether modern browsers (with ES modules) and Firebase can be used together, nicely.

What is missing is equally important.

Because of ES modules (and Vite), there is no need for a traditional bundler. You don't even need to know such things existed.[^1]

There is no state store. A central state store has been a popular paradigm in web design in 2010's, but... it just doesn't have the problem to solve once we stream data off Firebase (which is the real store) to UI components, in a reactive way. State is everywhere - and it's just fine, because the ultimate truth is still only in one place.[^2]

[^1]: Bundlers were used in the 2010's for binding together JavaScript code from various sources. This was needed, because browsers (the runtime environment) did not support modularity, natively. Bundlers became unneeded with the rise of modularity in the runtime environment, itself, in the form of ES modules.

[^2]: The author has ditched the state store paradigm. If you feel they still are needed, you can absolutely add one into the mix.

Let's get back to normal text!

---


## Two development workflows

The above command started a local, emulated version of Firebase. You can also start it with `npm run dev:local`.

The other way is `npm run dev:online`. This works against your cloud Firebase project. We'll come to it shortly.

Differences of these modes:

||Back-end|Data|Users|Authentication|Central logging|
|---|---|---|---|---|---|
|`local`|emulated|primed from `local/docs.js`|primed from `local/users.js`|sign-in with `&user=<id>`|none|
|`online`|in the cloud|←<br/>changes are persistent|←|←|shown on console|

>**Note:** Tests (`npm test`) also use local mode but don't rely on the primed data or users. The benefit is that one can keep `npm run dev` running, and use it both for browser development and as a test back-end. The two use different Firebase projects so their data and users won't overlap.


### `dev:local`

Use this mode when:

- you are developing back-end features (Firestore security rules, Cloud Functions) and want to test that they work with the front-end. <font color=gray>*[instructions later in this doc]*</font>
- you want to start with primed data and users, each time, instead of persisting the changes
- you want to use automatic sign-in, to speed up development a few clicks
- you don't have a Firebase account (yet?)

With local mode, you can test back-end features while developing them, and only deploy working back-end stuff. This means you should not need a "development environment" in the cloud, but only "staging" and production (more of those, later).

<!-- tbd. eventually, move workflow discussions to the root level
-->

#### Launch

Let's see a bit in detail, what happens when you start the app:

```
$ npm run dev:local

> groundlevel-es6-firebase@0.0.0 dev:local /Users/asko/Git/GroundLevel-es6-firebase-web
> concurrently -n emul,dev-local "firebase emulators:start --only functions,firestore" "npm run _dev_local_2"

[dev-local] 
[dev-local] > groundlevel-es6-firebase@0.0.0 _dev_local_2 /Users/asko/Git/GroundLevel-es6-firebase-web
[dev-local] > wait-on http://localhost:4000 && node ./local/init.js && npx vite --port 3001 --mode dev_local
[dev-local] 
[emul] i  emulators: Starting emulators: functions, firestore
[emul] ⚠  Your requested "node" version "10" doesn't match your global version "14"
[emul] i  firestore: Firestore Emulator logging to firestore-debug.log
[emul] i  ui: Emulator UI logging to ui-debug.log
[emul] i  functions: Watching "/Users/asko/Git/GroundLevel-es6-firebase-web/functions" for Cloud Functions...
[emul] ✔  functions[logs_v1]: http function initialized (http://localhost:5001/vue-rollup-example/europe-west3/logs_v1).
[emul] 
[emul] ┌───────────────────────────────────────────────────────────────────────┐
[emul] │ ✔  All emulators ready! View status and logs at http://localhost:4000 │
[emul] └───────────────────────────────────────────────────────────────────────┘
[emul] 
[emul] ┌───────────┬────────────────┬─────────────────────────────────┐
[emul] │ Emulator  │ Host:Port      │ View in Emulator UI             │
[emul] ├───────────┼────────────────┼─────────────────────────────────┤
[emul] │ Functions │ localhost:5001 │ http://localhost:4000/functions │
[emul] ├───────────┼────────────────┼─────────────────────────────────┤
[emul] │ Firestore │ localhost:8080 │ http://localhost:4000/firestore │
[emul] └───────────┴────────────────┴─────────────────────────────────┘
[emul]   Other reserved ports: 4400, 4500
[emul] 
[emul] Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
[emul]  
```

The emulators are started in the background. A `wait-on` module waits for them to be up and then launches a script that primes the emulated Firestore instance with data and local users:

```
[init] Primed :)
```

The command then proceeds to serve the files, using Vite:

```
[init]   ⚡Vite dev server running at:
[init] 
[init]   > Local:    http://localhost:3000/
[init]   > Network:  http://192.168.1.62:3000/
[init] 
[init]   ready in 313ms.
...
```

>WARNING: Changes you make while in "local" mode are LOST WHEN YOU STOP the server. This is intentional. It's a nice way of starting again, afresh.

The data used for priming is located in `local/docs.js`. Users created are in `local/users.js`. You can customize these to your/your team's liking.


### `dev:online`

With "online" development, you run against the Firebase back-end services of your active project, but still have hot-module-reload to help in developing the UI.

Use this when:

- the back-end is stable, and you are working on UI features
- you don't mind actually changing data
- you have a Firebase account
- you want to sign in as a real user

#### Firebase project

Check the [main repo](https://github.com/akauppi/GroundLevel-es-firebase-web) for instructions on how to create a Firebase project. Then:

```
$ firebase use --add
```

>**Deep note**: 
>When using Firebase hosting, one's project configuration is offered automatically at `/__/firebase/init.js[on]`. We use Vite so an extra step is needed: the `package.json` scripts ask Firebase CLI for the active project each time you run `npm run dev:online`, and write the information to `vitebox/.env.development` file, from where browsers get it.

#### Security note

The access values ("apiKey" and "authDomain") needed for Firebase authentication are not exactly secret. This repo has been created in a way that you don't need to store them in the version control, but they are visible for anyone having access to your web app.

The guidance on how to deal with these values varies a bit between Firebase and Google Identity Platform (superset of Firebase):

- [Learn about using and managing API keys for Firebase](https://firebase.google.com/docs/projects/api-keys) (Firebase docs)
- Google Identity Platform: [Using API keys](https://cloud.google.com/docs/authentication/api-keys) (Google Cloud docs)

   The author restricted their API key by:
   1. Google Cloud console > `APIs & Services` > `Credentials` > `API Keys` > `Browser key (auto created by Firebase)` (click)
   3. `API Restrictions` > `Restrict key` > `[x] Identity Toolkit API`

   >![](.images/gip-api-restriction.png)

#### Launch! 🚀

Launch the server:
  
```
$ npm run dev:online
...
```

Point your browser to `http://localhost:3001`.

Changes to your front-end files are still reflected in the browser, but back-end services are now run in the cloud. Changes you do to the data will persist. Access you do will be using your [quotas](https://firebase.google.com/docs/functions/quotas).

You can run the two modes simultaneously, in different terminals. By default, local uses port 3000 and online port 3001.


### When to use which mode?

Just try, which suits your way. :)

As a guideline, if you work on UI features only, `dev:online` may be better.

If you work on removing data, `dev:local` may suit best, since it makes it always boots from a known-good data set (and users).

You can customize the `local/*` setup to your development needs. Tests use something similar to "local" mode, but carry their own data and users. Thus, they are safe from your changes.

Before we look at tests (separate page), a brief mention on linting:


## Linting

```
$ npm run lint
...
```

This gives you warnings that you may or may not wish to fix. Steer them at `.eslintrc.cjs`.

>Note: At the moment (Jan 2021) we're not focused on reducing the number of lints (if they are warnings).

With the sample app, there may be warnings but there should not be errors.

---

Next: [Running tests](./README.2-tests.md)
