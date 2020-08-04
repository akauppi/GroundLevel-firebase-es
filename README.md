# GroundLevel * ES6 * Firebase

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

Module-sized bundling for production.

<br/>

## Easy for beginners

If the above distilled list of contents surpasses your current level of knowledge, don't turn back, yet. This repo is intended for professionals and beginners, alike. Its main point is to showcase how easy, and effective, making Web Applications in the 2020's is, when (only) modern tools are used.

One learns best by reading other people's code. Actual code. This template is made with that in mind. It's not a partial template, and doesn't feature a to-do list ;). It does (intend to) feature:

- social invites
- collaboration
- interactive graphics

This hopefully makes the app not only easy, but interesting as well.

Below, you'll find instructions on how to get started. You are encouraged to use this template as a basis for your own special Web App, but please observe the points (later) about removing the branding.

Let's get started! 😀




## Firebase

Forgot to mention Firebase.

This repo uses the Firebase serverless framework for a lot of things. Authentication, running background functions and storing data in the cloud.

Firebase allows a mere mortal to create fully functional cloud-based applications. You don't need to set up and maintain servers, or have a separate repository for "back end code". You don't need to make interface definitions (between the front and the back ends). With Firebase, the front end interacts directly with the Cloud Firestore database, and the database access rules become the de facto interface definition.

<!-- tbd. picture about front/REST/backend/database (left) vs. front/database (and cloud functions) (right) -->

![](.images/backend-vs-firebase.png)

*Figure 1. Traditional cloud vs. Firebase approach <sub>[source](https://docs.google.com/drawings/d/15_rPDZDOCHwdL0RIX8Rg3Der1tb4mx2tMi9asQ_aegw)</sub>*

You can still make REST API's if you want. But also those get defined within this same repo, as Cloud Functions.

There are other similar offerings from other companies, but they are years behind, in the ease of use, based on the author's opinion.



## Requirements

- `npm`
- `firebase`
  - `npm install -g firebase-tools`

>💡 From time to time, run the `npm install -g firebase-tools` command again, to update the tools. Especially worth it if you run into problems.

<!--
Developed with Firebase 8.4.3 on macOS; Node 14.4
-->

### Firebase plan

Firebase requires you to sign up to the "Blaze" plan, in order to deploy Cloud Functions. This means you need to give a credit card but does not necessarily introduce cost.

You can still use this repo for local development and training with the "Spark" (free) plan, and an emulator.

### Firebase project

You need to:

- create a Firebase project at the [Firebase console](https://console.firebase.google.com/)
  - enable hosting and authentication
  - create an app (needed for ...)
  - choose the set of authentication providers you like (Google, anonymous recommended)
- `firebase login`
- `firebase use --add` to activate the project for this working directory

<!-- tbd. what was the app necessary for? -->

>Note: You don't need to use `firebase init` - that one is for creating a repo from scratch. `firebase use --add` is all that's needed.

#### Development configuration 

When using Firebase hosting for development, one's project configuration is offered at a certain URL (`/__/firebase/init.js`). However, we use Vite so we need to catch the config and expose it in a file.

>Note: You can also see the project configuration in the Firebase Console. `Settings` > `Your apps`.

The values are *not* secrets. You may place the file in version control, if you want. Anyone having access to your Web App will be able to see the parameters, if they want to.

We've done a script that starts Firebase hosting momentarily, and lists the settings for you.

```
$ npm run __
...
{
  "projectId": "your-project-name",  
  ...
}
```

Create `.__.js` with these keys:

```
const __ = {
  apiKey: '...',
  projectId: '...',
  authDomain: '...'
}
export { __ }
```

If you use Firebase hosting for deployments (default), this file only matters for the development work.

Now we're finally ready to get started...!


## Getting started

Fetch dependencies:

```
$ npm install
```

<!-- hidden because noisy and not relevant for most
>macOS Note: If you get `gyp: No Xcode or CLT version detected!` error:
>
>   ```
>   # trash `/Library/Developer/CommandLineTools`
>   $ xcode-select --install
>   ```
-->

### Running tests

```
$ npm test
...  
```

This runs tests for:

- security rules
- Cloud Functions
- front-end APP

>Note: There are currently no UI side tests for the project, but this is intended to change, eventually. You should look into [Cypress](https://www.cypress.io) if you don't already have a favourite app level testing toolkit.


### Dev mode

```
$ npm run dev
...
vite v0.6.0
Dev server running at:
  > http://localhost:3000
...
```

This serves the UI locally, against your Firebase project in the cloud. You can edit the UI sources and changes should be reflected in the application. This is called Hot Module Replacement.

Try it out at [http://localhost:3000](http://localhost:3000). Can you sign in?

Try making some changes and see that they are reflected in the browser.


## Two development workflows

The above command started an "online" development workflow. You can also start it with `npm run dev:online`. In it, changes to the front-end are reflected in the browser but back-end features (database, Cloud Functions) are run online.

The "online" workflow is recommended when you are working with the UI code, but the full story is a bit longer. Next, we'll look into the "local" workflow.

>Note: Firebase is pushing for use of the local emulator. It is likely we'll change that workflow to be the default one, during 2020.


### `dev:local`

When working on Firestore security rules, or Cloud Functions, you are better off running locally:

- faster change cycle (no deployments)
- no costs
- from Aug 2020 onwards, only possible mode for users on Spark plan (free)

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
[dev-local] Priming...
[dev-local] Primed :)
```

The command then proceeds to serve the files, using Vite:

```
[dev-local] vite v1.0.0-beta.11
[dev-local] 
[dev-local]   Dev server running at:
[dev-local]   > Local:    http://localhost:3001/
[dev-local]   > Network:  http://192.168.1.62:3001/
[dev-local]   > Network:  http://169.254.160.107:3001/
[dev-local] 
...
```

You can now access the app in [localhost:3001](localhost:3001). 

>Note: We intentionally keep the ports separate for the two dev modes. You can launch them simultaneously, if you want.

WARNING: Changes you make while in "local" mode are LOST WHEN YOU STOP the server. This is intentional. It's a nice way of starting again, afresh.

The primed data is located in `local/data.js`. You should customize this data to your/your team's liking. At the least update the user ids in the beginning:

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

Then insert such a UID in `local/data.js`, restart the server and you should have some data to play with.


<!-- stashed; too much
>Note: Firebase has mentioned 24-Jun-20 (Firebase live's comments) that they aim to bring also auth into the local emulation. This should allow fully offline development! 🎉
-->

#### When to develop in local mode?

As mentioned above, for just developing the UI, it may be nice to work against real (changing) data. It just feels more normal. 

If you intend to test things like removal of data, local mode may be better, since changes are not permanent.

For back-end work, local mode rocks!

You can also run these modes simultaneously, in different terminals. By default, online uses port 3000 and local port 3001.


<!-- tbd.
## Configuration

...discuss `src/config.js`
-->

## Tests and Linting

```
$ npm run lint
...
```

This gives you warnings that you may or may not wish to fix. Steer them at `.eslintrc.cjs`.


## Security Rules

If you are serious about development, have a look at the `rules-test` sub-project. It has tests to check the rules we have in `firestore.rules` behave as intended.

Since this is quite an added complexity (more `npm` dependencies), it's been left as a self-sufficient sub-project.

```
$ cd rules-test
$ npm install
...
$ npm test
```

Please see its own [README](rules-test/README.md) file.

>Plan: We may turn to Docker in the future, to better integrate testing security rules as part of the repo, itself (no sub-project, no second `node_modules`), yet not bring the complexity of the tools to the main project. `package.json` should carry only the dependencies the main project needs.


## Production workflow

<strike>For production builds, we use Rollup. You find the configuration in [rollup.config.js](rollup.config.js).</strike>

>Reasons not to use Vite for production:
> 
>- we wish to keep HTML unmodified, but Vite insist in bunding even scripts within it (!)
>- we wish to experiment with ES6 modules all the way (vs. bundle)
>- Rollup simply gives a better feeling of control

### Production build

```
$ npm run prod:build
```

This creates the deployables at `public/`.

You can tune the settings to your liking. There is no one single best set, and tastes differ.

Default setup has:

- only ES6 modules from npm (no CommonJS)
- preserve modules (no bundling)

>Hint: To enable support for CommonJS modules[^1-cjs], uncomment `//import commonjs from '@rollup/plugin-commonjs';` and `//commonjs()` lines (not tested!).


### Testing production build

```
$ npm run prod:serve
```

Local Firebase serving of the production build.



### Deployment

Once you've got your app together, you want to roll it out to the world. There are many ways, either manually or using a CI/CD pipeline.

We'll walk you through the manual steps. You can build the CI/CD pipeline based on them - people's taste often differs on those so we don't want to enforce certain way (except for production - see later).

>NOTE TO SELF: *CI/CD without tests is a bad idea. We (read: You :) ) should have `npm test` test your UI before even thinking of automating deployment. Time better used.*

><font color=red>`npm run build` implementation will likely change. Vite bundles everything together (including scripts from `index.html`) and the author doesn't like that. 
>
>Instead, we may go with Rollup directly, and configure it to just collect ES6 modules instead of bundling. The reason Vite insists on bundling is a claimed "avalanche" of module dependencies, but we'll need to see that for ourselves. The end user (you) should have a choice, here.</font>

```
$ npm run build
...
```

>Note: The output bundle sizes shown on the console are not quite what's in the file system. #help

This builds a production mode front end under `dist/`.

><font color=red>BROKEN GLASS!! Production build with Vite still needs work. The output (index.html) is broken!

To check it's working, we can serve it (don't try opening the `index.html` from the file system).

```
$ firebase serve --only hosting --port 3002
```



### Deploy

Deploying Cloud Functions uses the `functions/package-lock.json`. While we don't keep the file for the main project, it seemed like a good thing, not to supress it there. The idea is to make sure local emulation and Cloud Function run with the same node.js dependencies.


```
$ firebase deploy

=== Deploying to 'vue-rollup-example'...

i  deploying hosting
i  hosting[vue-rollup-example]: beginning deploy...
i  hosting[vue-rollup-example]: found 3 files in ./public
✔  hosting[vue-rollup-example]: file upload complete
i  hosting[vue-rollup-example]: finalizing version...
✔  hosting[vue-rollup-example]: version finalized
i  hosting[vue-rollup-example]: releasing new version...
✔  hosting[vue-rollup-example]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/vue-rollup-example/overview
Hosting URL: https://vue-rollup-example.firebaseapp.com
```

Visit the stated URL. :)

Note: These instructions are no-where complete, and you should really visit the Firebase documentation (it being awesome!! 🥳). Check e.g. [Test locally then deploy to your site](https://firebase.google.com/docs/hosting/deploying)

</font>

<!-- disabled, to keep things short-ish
## Digging deeper...

The template aims to cover more ground:
 
- [x] Authentication
- [x] Cloud Firestore; creating an actual collaborative app behind the authentication
  - [ ] invitations
- [x] Logging
- [ ] Performance monitoring
- [ ] A/B testing

Stay tuned for these developments, or chime in to make them happen!!! 🏅
-->

<!--
## Production tier

//using CI/CD; not manually; once there are tests
...
-->

<!--
## Monitoring

- about Logging (already set up)
-->


## Developing *your* app

The repo is intended to be used as an application template. By doing so, you make its purpose come true!

### Back-tracking changes

We need to develop / think of ways to allow a derivative of this repo to gain updates, if they so wish.

<font color=red>
If you keep the Git history, you should be able to `git pull` changes, but how messy that becomes in practise remains to be seen.
</font>

### Remove branding

Please remove all "GroundLevel" branding, once you turn this into something else. In particular:

1. Remove the `iconart` and `public/favicon*` files. They are not licensed for other use than this template. Thanks!
2. Change the `name`, `version`, `repository.url` and `author` fields in `package.json` to match your application.
3. Visit the `src/config.js` and suit it to your project (title etc.).

```
$ git grep "[gG]round[Ll]evel"
```

Please remove/edit those files, to remove any mention. You may mention using this repo as your starting point, but are not obliged to do so.


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

 