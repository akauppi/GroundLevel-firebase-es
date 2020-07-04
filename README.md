# GroundLevel * ES6 * Firebase

[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src="iconart/logo_512x512.png" width=300 align="left" style="margin: 40px">

<br />
<br />

**A foundation for a web app, using Firebase suite of back-end tools.**

You want a web app and you want it now?

This aims to become the best place to make that happen. 

- great tools, selected for you: Vite, Firebase, Vue.js 3 (beta), Rollup
- built on 2020's technology (ES6, async/await), aiming to stay up to date

Let's start! 🤾‍♀️

<br/>


## Tools selected

Focus on Firebase and ES6 are something this repo is about. Those will remain. Other tools may be changed.

- Vue.js 3 as the UI framework
- [Vite](https://github.com/vitejs/vite) for ultra-fast development
- [Vue Router](https://github.com/vuejs/vue-router-next) 4
- [Rollup](https://rollupjs.org/guide/en/) for production builds
- [Firebase hosting]() for hosting

Note the omissions: 

|instead of...|...this|
|---|---|
|Vue CLI|Firebase and Vite|
|central state management|Vue.js 3 `reactive` and `ref` with component-level state|

<!-- tbd. add Vue.js link when 3 officially out -->


## Requirements

- `npm`
- `firebase`
  - `npm install -g firebase-tools`

>💡 From time to time, run the `npm install -g firebase-tools` command again, to update the tools. Especially worth it if you run into problems.

<!--
Developed with Firebase 8.4.3 on macOS; Node 14
-->

### Firebase plan

From Aug 2020 onwards, Firebase requires you to sign up to the "Blaze" plan, in order to deploy Cloud Functions. This means you need to give a credit card but does not necessarily introduce cost.

You can still use this repo for local development and training with the "Spark" (free) plan, and an emulator.

More details in [BILLING](./BILLING.md).


### Firebase project

You need to:

- create a Firebase project at the [Firebase console](https://console.firebase.google.com/)
  - enable hosting and authentication
  - choose the set of authentication providers you like (Google, anonymous recommended)
- `firebase login`
- `firebase use --add` to activate the project for this working directory

>Note: You don't need to use `firebase init` - that one is for creating a repo from scratch. `firebase use --add` is all that's needed.

#### Development configuration 

`firebase use --add` sets `.firebaserc` and maybe some other files not in the version control. This is not enough for the front end to tie to your project. For that, there is a `.__.js` file that needs to be changed.

>Note: This only matters for development, and is needed because we use Vite (not Firebase hosting) as the development platform. The name `__` comes from Firebase - it hosts this data as `__/firebase/init.js`.

We've done a script that starts Firebase hosting momentarily, and lists the settings for you. You can see them also in Firebase console.

```
$ npm run __
...
{
  "projectId": "your-project-name",  
  ...
}
```

Edit `.__.js` and transport the required keys there.

Now we're finally ready to get started...!


## Getting started

Fetch dependencies:

```
$ npm install
```

<!-- disabled (but keep)
>macOS Note: If you get `gyp: No Xcode or CLT version detected!` error:
>
>   ```
>   # trash `/Library/Developer/CommandLineTools`
>   $ xcode-select --install
>   ```
-->

<!--
### Running tests
-->
There are currently no UI side tests for the project. 😢

<!-- tbd. Once there are:
```
$ npm test
...  
```
-->

```
$ npm run dev
...
vite v0.6.0
Dev server running at:
  > http://localhost:3000
...
```

This serves the UI locally, reacting to source code changes. Back end is your Firebase project in the cloud.

Try it out at [http://localhost:3000](http://localhost:3000). Sign in.

The code is served by [Vite](https://github.com/vuejs/vite) (GitHub). It renders changes to your sources on-the-fly (this is called Hot Module Replacement), speeding up development and experimentation. It's great! 

Try making some changes and see that they are reflected in the browser.


## Development workflow

The above command started an "online" development workflow. You can also start it with `npm run dev:online`. In it, changes to the front-end are reflected in the browser but back-end features (database, Cloud Functions) are run online.

The "online" workflow is recommended when you are working with the UI code, but the full story is a bit longer. Next, we'll look into the "local" workflow.

>Note: Firebase is pushing for use of the local emulator. It is likely we'll change that workflow to be the default one, during 2020.


### `dev:local`

When working on Firestore security rules, or Cloud Functions, you are better off running locally:

- faster change cycle (no deployments)
- no costs
- from Aug 2020 onwards, only possible mode for Spark plan users

Local mode means that even with back-end features, you only start deploying working stuff. This changes the role of the cloud project to be more of a staging environment than a development hot-pot.

Especially important for working in a team. Developers can now separately develop the UI (using either dev mode) or the back-end features (local mode) and commit their changes once they are already tested.

( We'll come back to this with production tier, later. )

```
$ npm run dev:local

> groundlevel-es6-firebase@0.0.0 dev:local /Users/asko/Git/GroundLevel-es6-firebase-web
> start-server-and-test "firebase emulators:start --only functions,firestore" 4000 "node ./local/init.js && npx vite --port 3001"

1: starting server using command "firebase emulators:start --only functions,firestore"
and when url "[ 'http://localhost:4000' ]" is responding with HTTP status code 200
running tests using command "node ./local/init.js && npx vite --port 3001"

i  emulators: Starting emulators: functions, firestore
⚠  emulators: It seems that you are running multiple instances of the emulator suite for project vue-rollup-example. This may result in unexpected behavior.
⚠  Your requested "node" version "10" doesn't match your global version "14"
i  firestore: Firestore Emulator logging to firestore-debug.log
i  ui: Emulator UI logging to ui-debug.log
i  functions: Watching "/Users/asko/Git/GroundLevel-es6-firebase-web/functions" for Cloud Functions...
✔  functions[logs_v1]: http function initialized (http://localhost:5001/vue-rollup-example/europe-west3/logs_v1).

┌───────────────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! View status and logs at http://localhost:4000 │
└───────────────────────────────────────────────────────────────────────┘

┌───────────┬────────────────┬─────────────────────────────────┐
│ Emulator  │ Host:Port      │ View in Emulator UI             │
├───────────┼────────────────┼─────────────────────────────────┤
│ Functions │ localhost:5001 │ http://localhost:4000/functions │
├───────────┼────────────────┼─────────────────────────────────┤
│ Firestore │ localhost:8080 │ http://localhost:4000/firestore │
└───────────┴────────────────┴─────────────────────────────────┘
  Other reserved ports: 4400, 4500

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
 
Priming...
Primed :)
vite v1.0.0-beta.1
[vite] Optimizable dependencies detected:
firebase, vue

  Dev server running at:
  > Local:    http://localhost:3001/
  > Network:  http://192.168.1.62:3001/
  > Network:  http://169.254.122.162:3001/

...
```

When loading, the Firestore data is primed from `local/data.js`. You can edit this data to your liking. It is by design that the emulator suite does not persist any data changes. When you Ctrl-C the process, the changes to the data are lost. (This is also a feature, to start afresh, do exactly that).

With local mode, authentication still happens online so you do need to have the Firebase project set up.

>Note: Firebase has mentioned 24-Jun-20 (Firebase live's comments) that they aim to bring also auth into the local emulation. This should allow fully offline development! 🎉


### When to use local mode?

We provide you both. As mentioned above, for just developing the UI, it may be nice to work against real (well, staging) data. For back-end work, local mode rocks!

You can also run these modes simultaneously, in different terminals. By default, online uses port 3000 and local port 3001.

>Note: Differentiating the modes in the UI is currently (Jun 2020) done by the port. This is not ideal, and may change at some point. Essentially, we have two dev modes whereas Vite assumes there's always just one.


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


### Testing Security Rules

If you are serious about development, have a look at the `rules-test` sub-project. It has tests to check the rules we have in `firestore.rules` behave as intended.

Since this is quite an added complexity (more `npm` dependencies), it's been left as a self-sufficient sub-project.

```
$ cd rules-test
$ npm install
...
$ npm test
```

Please see its [README](rules-test/README.md) file.

>Plan: We may turn into Docker in the future, to better integrate testing security rules as part of the repo, itself (no sub-project, no second `node_modules´), yet not bring the complexity of the tools to the main project.


## Adopting into Your App!

<!-- Editor's note
This text suits pretty badly to where it currently is. Should we move it to "Branding" at the end???  (this is a dinosaur, and the doc developed around it)
-->

This is where You can code.

We presume you have a suitable IDE (WebStorm, VS Code), and know web programming (JavaScript, HTML, CSS). If you are new to programming, just study the existing code and tinker with it.

Three steps to remove GroundLevel branding:

1. Please remove the `iconart` and `public/favicon*` files. They are not licensed for other use than this template. Thanks!
2. Change the `name`, `version`, `repository.url` and `author` fields in `package.json`, to match your application.
3. Visit the `src/config.js` and suit it to your project (title etc.).

You may mention using this repo as your starting point, but are not obliged to do so.


## Production workflow

For production builds, we use Rollup. You find the configuration in [rollup.config.js](rollup.config.js).

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

## Back-tracking changes

We need to develop / think of ways to allow a derivative of this repo to gain updates, if they so wish.

If you keep the Git history, you should be able to `git pull` changes, but how messy that becomes in practise remains to be seen.



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
