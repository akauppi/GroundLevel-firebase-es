# GroundLevel * ESM * Firebase

[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src="iconart/logo_512x512.png" width=300 align="left" style="margin: 40px">

<br />
<br />

<!-- dismantled
**A foundation for a web app, using Firebase suite of back-end tools.**

You want a web app and you want it now?

This aims to become the best place to make that happen. 

- great tools, selected for you: Vite, Firebase, Vue.js 3 (beta), Rollup
- built on 2020's technology (ES6, async/await), aiming to stay up to date

Let's start! 🤾‍♀️
-->

**A modern (ES modules based) Web App template**

We use Vite for development workflow, and ES modules for partitioning the code. Vue.js 3 (beta) for defining the front end. Vue Router for client side routing.

No central state management - Vue.js 3 `ref`s and `reactive`s make each component perfectly capable of handling their state, and exposing it.

Jest for back-end testing.

Module-sized bundling for production.

<br/>

## Easy for beginners

<!-- unneeded (no actual info!)
If the above distilled list of contents surpasses your current level of knowledge, don't turn back, yet. This repo is intended for professionals and beginners, alike. Its main point is to showcase how easy, and effective, making Web Applications in the 2020's is, when (only) modern tools are used.
-->

One learns best by reading other people's code. Actual code. This template is made with that in mind. It's not a partial template, and doesn't feature a to-do list ;). It does (intend to) feature:

- social invites
- collaboration
- interactive graphics

This hopefully makes the app not only easy, but interesting as well.

On the technical side:

- testing of back-end features
- development workflow, using emulators
- deployment to production

Below, you'll find instructions on how to get started. You are encouraged to use this template as a basis for your own special Web App, but please observe the points (later) about removing the branding.

Let's get to it! 😀




## Firebase

This repo uses the Firebase serverless framework for a lot of things. Authentication, running background functions and storing data in the cloud.

Firebase allows a mere mortal to create fully functional cloud-based applications. You don't need to set up and maintain servers, or have a separate repository for "back end code". You don't need to make interface definitions (between the front and the back ends). With Firebase, the front end interacts directly with the Cloud Firestore database, and the database access rules become the de facto interface definition.

>![](.images/backend-vs-firebase.png)

*Figure 1. Traditional cloud vs. Firebase approach <sub>[source](https://docs.google.com/drawings/d/15_rPDZDOCHwdL0RIX8Rg3Der1tb4mx2tMi9asQ_aegw)</sub>*

There are similar offerings from other companies, but they are years behind, in the ease of use, based on the author's opinion.

### Blaze vs. Spark (Firebase plans)

In order to deploy Cloud Functions, Firebase requires you to sign up to the "Blaze" plan. This means you need to give a credit card but does not necessarily introduce cost.

You can still use this repo for local development (see "dev:local", below) even without a Firebase account or a project. If your project doesn't require Cloud Functions, you can use the "Spark" (free) plan and still deploy.


## Requirements

- `npm`
- `firebase`
  - `npm install -g firebase-tools`

You should use `firebase-tools` >= 8.11.1. <!-- because of https://github.com/firebase/firebase-tools/issues/2610 -->

>💡 From time to time, run the `npm install -g firebase-tools` command again, to update the tools. Especially worth it if you run into problems.

<!-- tbd. is this actually needed?:
Set up the Firestore emulator:

```
$ firebase setup:emulators:firestore
```

>Note: Rerun the setup above if you have upgraded `firebase-tools`.
-->

<!--
The repo is developed with latest `firebase` (8.11.0) and Node.js (14.12.0) on macOS.
-->


## Getting started ⏱

Fetch dependencies:

```
$ npm install
```

### Directory layout

Back-end features (Cloud Firestore Security Rules and Cloud Functions) have their own directory, `back-end`. This is just a convention followed in this repo.

We don't want two `node_modules` folders, so tools and scripts for back-end testing are included in the root `package.json`, alongside the front-end features. Again, this is just a convention.

The Cloud Functions have their own node environment. Fetch its dependencies:

```
$ (cd back-end/functions && npm install)
$ cd ..
```

### Running tests

```
$ npm test
...  
```

This runs tests for:

- back end / Cloud Functions
- back end / security rules
- front-end APP

>Note: There are currently no UI side tests for the project, but this is intended to change, eventually. Look into [Cypress](https://www.cypress.io) if you don't already have a favourite app level testing toolkit. We'll get there.

The tests should all pass (or be skipped). If some test fails, please [create an issue](https://github.com/akauppi/GroundLevel-es6-firebase-web/issues).


### Dev mode

You don't even need a Firebase project, to get started.

```
$ npm run dev
...
vite v0.6.0
Dev server running at:
  > http://localhost:3000
...
```

This serves the UI locally, against an emulated Firebase back-end, with Security Rules applied. You can edit the UI sources and changes should be reflected in the application. This is called Hot Module Replacement.

Try it out at [http://localhost:3000](http://localhost:3000). Can you sign in?

Try making some changes in the `src/**` files and see that they are reflected in the browser.


## Two development workflows

The above command started a local, emulated version of Firebase. You can also start it with `npm run dev:local`. 

The other way is `npm run dev:online`. This works against your cloud Firebase project. We'll come to it shortly.

The "online" workflow is recommended when you are working with the UI code, but the full story is a bit longer.

>Note: Authentication normally requires a Firebase project to be set up. Here, we are piggy-backing an existing project (details in `src/init-dev.vite.js`) so that you get going, faster.


### `dev:local`

When working on Firestore security rules, or Cloud Functions, you are better off running locally:

- faster change cycle (no deployments)
- no costs
- since Aug 2020, only possible mode for users on Spark plan

With local mode, you can develop back-end features locally, and only deploy working stuff. This changes the role of the cloud project to be more of a staging environment than a development hot-pot. This is good.

Especially important for working in a team. Developers can now separately develop the UI (using either dev mode) or the back-end features (local mode) and commit their changes once they are already tested.

We'll come back to deployments with the production tier, later. 

Let's start the app in local mode:

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

The emulators are started in the background. A `wait-on` module waits for them to be up and then launches a script that primes the emulated Firestore instance with data:

```
[dev-local] Primed :)
```

The command then proceeds to serve the files, using Vite:

```
[dev-local] vite v1.0.0-beta.11
[dev-local] 
[dev-local]   Dev server running at:
[dev-local]   > Local:    http://localhost:3000/
[dev-local]   > Network:  http://192.168.1.62:3000/
[dev-local]   > Network:  http://169.254.160.107:3000/
[dev-local] 
...
```

You can now access the app in [localhost:3000](localhost:3000). 

WARNING: Changes you make while in "local" mode are LOST WHEN YOU STOP the server. This is intentional. It's a nice way of starting again, afresh.

The data used for priming is located in `local/docs.js`. You should customize this to your/your team's liking. At the least update the user ids in the beginning:

```
// Change the user id's to match your own. Check them from Firestore console.
//
const abc = "7wo7MczY0mStZXHQIKnKMuh1V3Y2"
const def = "def"
```

Replace the users with some people from your team, and you should be able to see the sample data in the UI.

To pick up your Firebase user id, either:

- use the "online" mode first, create some data and find the user id's in Firebase Console > `Database`

   >![](.images/uid-from-cloud.png)
  
- sign in in the browser, open the developer console and check `firebase.auth().currentUser.uid`.

   ![](.images/uid-from-browser.png)

Then insert such a UID in `local/docs.js`, restart the server and you should have some data to play with.


### `dev:online`

With "online" development, you run against the Firebase back-end services of your active project. You can also use third party monitoring services but we don't need to activate them, yet.

Now, let's create a Firebase project for your app. 😀

#### Setting up Firebase project

- Create a project in the [Firebase console](https://console.firebase.google.com/)
   - enable hosting, authentication, Cloud Firestore and Cloud Functions
   - create an app (needed for authentication)
   - choose the set of authentication providers you like (Google, anonymous recommended)
- Tie your local CLI to your project:
   
   ```
   $ firebase login
   ```
   
   ```
   $ firebase use --add 
   ```
   
   The alias you choose doesn't really matter. `"abc"` is okay.
   
- Deploy back-end features:

   ```
   $ firebase deploy --only functions,firestore
   ```

#### Set up `.env.js`

When using Firebase hosting emulator, one's project configuration is offered automatically at `/__/firebase/init.js[on]` URLs. We use Vite for the hosting so an extra step is needed.

>Note: this needs `curl`. If you have difficulties, you can also find the necessary fields in the Firebase Console.

```
$ tools/print-__.sh
i  emulators: Starting emulators: hosting
i  hosting: Serving hosting files from: public
✔  hosting: Local server: http://localhost:5000
i  Running script: curl http://localhost:5000/__/firebase/init.json
{
  "projectId": "vue-rollup-example",
  "appId": "1:990955970646:web:400a55b0df8ba415c2dbf7",
  "databaseURL": "https://vue-rollup-example.firebaseio.com",
  "storageBucket": "vue-rollup-example.appspot.com",
  "locationId": "europe-west3",
  "apiKey": "AIzaSyD29Hgpv8-D0-06TZJQurkZNHeOh8nKrsk",
  "authDomain": "vue-rollup-example.firebaseapp.com",
  "messagingSenderId": "990955970646",
  "measurementId": "G-VJSH9D5HX1"
}i  hosting: 127.0.0.1 - - [14/Sep/2020:16:45:27 +0000] "GET /__/firebase/init.json HTTP/1.1" 200 - "-" "curl/7.64.1"
✔  Script exited successfully (code 0)
i  emulators: Shutting down emulators.
i  hosting: Stopping Hosting Emulator
i  hub: Stopping emulator hub
```

You only need some of the fields. We place them in a `.env.js` file.

```
$ cp .env.sample.js .env.js
```

Edit `.env.js` so that:

```
...

const firebase = {
  type: 'firebase',

  // Needed when we host with Vite
  apiKey: ...,
  appId: ...,   // needed for Firebase Performance Monitoring
  projectId: ...,
  authDomain: ...
}
...
```

The values are *not* secrets. You may place the file in version control, if you want (and remove the sample). Anyone having access to your Web App will be able to see the parameters, if they want to.

<!-- later, alligator 🐊
>Note: If your `locationId` is something else than "europe-west3", change occurrences of `"europe-west3"` within the repo. Remind us about this in Issues, to make this a globally friendly project. 🌏
-->

The file can also carry third party tool access id's. We'll return to that in the ops section.

#### Launch! 🚀

Launch the server:
  
```
$ npm run dev:online
...
```

Point your browser to `http://localhost:3001`.

Changes to your front-end files are still reflected in the browser, but back-end services are now run in the cloud. Changes you do to the data will persist. Access you do will be using your [quotas](https://firebase.google.com/docs/functions/quotas).


### When to develop in local mode?

For just developing the UI, it may be nice to work against real (changing) data. It just feels more normal. 

If you intend to test things like removal of data, local mode may be better, since changes are not permanent.

For back-end work, local mode rocks!

You can also run these modes simultaneously, in different terminals. By default, local uses port 3000 and online port 3001.


### Note: Making your local mode your own :)

We took a shortcut in the code, letting you play with `dev:local` *before* setting up a Firebase project. Now that you are familiar with the setup, visit `src/init.vite.js` and see if you can make it, too, use the `__.js` file you've created. This way, you will not be at the mercy of any alien project. 👾👾👾


## Tests and Linting

```
$ npm run lint
...
```

This gives you warnings that you may or may not wish to fix. Steer them at `.eslintrc.cjs`.

>Note: At the moment (31-Aug-20) we're not focused on reducing the number of lints (if they are warnings).


## Back-end

We first told you don't need a back end but then there's such a directory. What's up?

What you don't need is deploying, managing and *scaling* your *servers*. That is automatic by Firebase. But you need to define the functionality that the back-end will do - it's still there.

We've placed this part behind a corner, in its own directory. These two share the same `package.json` (and thus the same `node_modules`), and you perform back-end testing in the project root directory. These are just conventions - you can separate the front and back even more, if you want to.

The testing of the back end benefits from [firebase-jest-testing](https://github.com/akauppi/firebase-jest-testing) that provides some useful tools.

Check out [back-end/README](back-end/README.md) for more information. 🦸‍♂️


## Production workflow

<!-- cut
We use the Rollup bundler *natively* for doing production builds. This is because of the repo's approach of using ES modules all the way, and Vite drops the baton a bit short. It insists on bundling.. 

>because native ES module imports result in waterfall network requests that are simply too punishing for page load time in production.

This is not necessarily true.
-->

### Rollup setup

For production builds, we use Rollup. You find the configuration in [rollup.config.prod.js](rollup.config.prod.js).

```
$ npm run prod:build
```

This creates the deployables in `public/dist`.

You can tune the settings to your liking. There is no one single best set, and tastes differ.

Default setup has:

- only ES6 modules (no CommonJS)
- preserve modules (no bundling)

>Hint: To enable support for CommonJS modules, uncomment `//import commonjs from '@rollup/plugin-commonjs';` and `//commonjs()` lines (not tested!).


### Testing production build

```
$ npm run prod:serve
...
✔  hosting: Local server: http://localhost:3010
...
```

Try it out at `localhost:3010`.

>WARNING: There's an issue with the [Firebase hosting crashing](https://github.com/akauppi/GroundLevel-es6-firebase-web/issues/22).


### Deployment

Once you've got your app together, you want to roll it out to the world. There are many ways, either manually or using a CI/CD pipeline.

We'll walk you through the manual steps. You can build the CI/CD pipeline based on them - people's tastes often differ on those so we don't want to enforce certain way (except for production - see later).

>NOTE TO SELF: *CI/CD without tests is a bad idea. We (read: You :) ) should have `npm test` test your UI before even thinking of automating deployment. Time better used.*

```
$ npm run prod:deploy:all

> groundlevel-es6-firebase@0.0.0 prod:deploy:all /Users/asko/Git/GroundLevel-es6-firebase-web
> firebase deploy

=== Deploying to 'vue-rollup-example'...

i  deploying firestore, functions, hosting
i  firestore: reading indexes from back-end/firestore.indexes.json...
i  cloud.firestore: checking back-end/firestore.rules for compilation errors...
✔  cloud.firestore: rules file back-end/firestore.rules compiled successfully
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
✔  functions: required API cloudbuild.googleapis.com is enabled
✔  functions: required API cloudfunctions.googleapis.com is enabled
✔  firestore: deployed indexes in back-end/firestore.indexes.json successfully
i  firestore: latest version of back-end/firestore.rules already up to date, skipping upload...
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (27.75 KB) for uploading
✔  functions: functions folder uploaded successfully
i  hosting[vue-rollup-example]: beginning deploy...
i  hosting[vue-rollup-example]: found 16 files in public
✔  hosting[vue-rollup-example]: file upload complete
✔  firestore: released rules back-end/firestore.rules to cloud.firestore
i  functions: updating Node.js 12 function logs_v190720(europe-west3)...
i  functions: updating Node.js 12 function fatal_v210720(europe-west3)...
i  functions: updating Node.js 12 function userInfoShadow(europe-west3)...
i  functions: updating Node.js 12 function greet(europe-west3)...
✔  functions[fatal_v210720(europe-west3)]: Successful update operation. 
✔  functions[greet(europe-west3)]: Successful update operation. 
✔  functions[logs_v190720(europe-west3)]: Successful update operation. 
✔  functions[userInfoShadow(europe-west3)]: Successful update operation. 
i  hosting[vue-rollup-example]: finalizing version...
✔  hosting[vue-rollup-example]: version finalized
i  hosting[vue-rollup-example]: releasing new version...
✔  hosting[vue-rollup-example]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/vue-rollup-example/overview
Hosting URL: https://vue-rollup-example.web.app
```

Visit the stated URL. :)

#### Lighthouse

Google Chrome has a Lighthouse tool to evaluate your site's performance. It's good to use occasionally, with different settings.

- Open Chrome and the web page. Sign in.
- `Show` > `Developers` > `Developer tools` (or Alt-Cmd-I shortcut on Mac)
- `Lighthouse` tab (may be hidden behind the `≫` icon)
- Pick the check boxes you are interested in, and `Generate report`

![](.images/lighthouse-report.png)

So proud of those results!! :)

If there are places to improvement, Lighthouse offers you links for more information.

Note that the deployment (`index.html` and Rollup configuration) is optimized for HTTP/2 delivery. At the time of writing (Sep 2020), local emulation does not work with HTTP/2<sub>[issue](https://github.com/firebase/firebase-tools/issues/2518)</sub>. We recommend using Lighthouse only on the production deployment.

>Note: If your results are sub-optimal and they can be improved by settings in this project, let us know.


## Developing *your* app

This repo can be used as an application template. By doing so, you make its purpose come true!

### Back-tracking changes

We need to develop / think of ways to allow a derivative of this repo to gain updates, if they so wish.

### Remove branding

Please remove all "GroundLevel" branding, once you turn this into something else. In particular:

1. Remove the `iconart` and `public/favicon*` files. They are not licensed for other use than this template. Thanks!
2. Change the `name`, `version`, `repository.url` and `author` fields in `package.json` to match your application.
3. Visit the `src/config.js` and suit it to your project (title etc.).

```
$ git grep "[gG]round[Ll]evel"
```

If there are any matches, please remove/edit those files. You may mention using this repo as your starting point, but are not obliged to do so.


## Help welcome!

If you wish to help, check out:

- [TODO.md](TODO.md)
- [Issues](https://github.com/akauppi/GroundLevel-es6-firebase-web/issues)

Issues has more formal definition of shortcomings and plans, and is the main forum of contributions and discussion. `TODO` is a shorthand for authors.

For a more permanent role, please check [JOBS.md](JOBS.md).


## Credits

Thanks to Jaakko Roppola for wonderful icon art!! 🙌

Thanks to Jonatas Walker for his [jonataswalker/vue-rollup-example](https://github.com/jonataswalker/vue-rollup-example) template. Based this work on it, then changed a few things.

Thanks to Gaute Meek Olsen for his template and [associated blog entry](https://gaute.dev/dev-blog/vue-router-firebase-auth) (Nov '19). This taught me how to use a Promise with `firebase.auth().onAuthStateChanged` properly.

Thanks to [Bootstrap Icons](https://icons.getbootstrap.com/) for SVG icon art.


## Other folders

We've stashed some things aside from this `README`:

- [DEVS](DEVS/) contains various notes for developers. These are not necessarily project specific - more like findings that you're good to be aware of. Check them out if you plan to contribute to the project. This is a wholly documentation-only folder so you can also just remove it, from your own project.
- [ops](ops/): Once you've deployed your application, this is where the Fun Starts! The `ops` folder contains everything operational:
   - [analytics](ops/README.md#Analytics)
   - metrics (tbd.)
   - logging (tbd.)
   - A/B testing (tbd.)


## References

- [Handling 3rd-party JavaScript with Rollup](https://engineering.mixmax.com/blog/rollup-externals/) (blog, Dec 2017)

- [Firebase web Codelab](https://codelabs.developers.google.com/codelabs/firebase-web/#1)
  - A walk-through that we followed, and took inspiration from
  - [source repo](https://github.com/firebase/friendlychat-web) (GitHub)
 
- [Easily add sign-in to your Web app with FirebaseUI](https://firebase.google.com/docs/auth/web/firebaseui) (Firebase docs)

- [Vue, guard routes with Firebase Authentication](https://dev.to/gautemeekolsen/vue-guard-routes-with-firebase-authentication-f4l) (blog, Nov 2019) 
  - associated [source code](https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication) (GitHub)
  - associated [narrative](https://gaute.dev/dev-blog/vue-router-firebase-auth)
  - learned about Vue-router with Firebase auth here! :)

<!-- Editor's note: Gaute's dev.to blog is slightly different from his gaute.dev entry. The latter is clearer, in some regards, so listing them both.
-->

### Cloud Firestore

- [Advanced examples of using Cloud Firestore Security Rules](https://medium.com/@khreniak/advanced-examples-of-using-cloud-firestore-security-rules-9e641d023c7e) (blog, Mar 2019)

- [Cloud Firestore Data Modeling (Google I/O'19)](https://www.youtube.com/watch?v=lW7DWV2jST0) (Youtube 40:37, May 2019)
   - INCREDIBLY GREAT video on essentially all aspects needed to be considered while designing a data model 🔥🔥🔥

<!-- enable once/if we have Typescript in
### Typescript

- [Configuring ESLint on a TypeScript project](https://www.jackfranklin.co.uk/blog/typescript-eslint/) (blog, Jan 2019)
- [Using Typescript with Vue Single File Components](https://www.digitalocean.com/community/tutorials/vuejs-using-typescript-with-vue)
-->

### Serving ES6 modules, HTTP/2 etc.

- [Using ES Modules in the Browser Today](https://www.sitepoint.com/using-es-modules/) (blog, May 2018)
- [Using Native JavaScript Modules in Production Today](https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/) (blog, Aug 2019)
   - this step-by-step guidance was instrumental in making the production build work with ES modules. Brilliant write!!! 💎

### Online forums

- [Firebase developers](https://discord.gg/BN2cgc3) (Discord server)

### Other Firebase/Vue application templates

- [Firelayer](https://firelayer.io)
  - seems visually pleasing!
  - likely Vue.js 2
  - likely uses bundling

<!-- tbd. When someone has checked Firelayer in detail, and can make a brief (2 sentence!) summary on how it differs from GroundLevel, that is a welcome #contribution!
-->



<!-- disabled (noisy and not relevant for most)
### Troubleshooting

>macOS Note: If you get `gyp: No Xcode or CLT version detected!` error:
>
>   ```
>   # trash `/Library/Developer/CommandLineTools`
>   $ xcode-select --install
>   ```
-->

