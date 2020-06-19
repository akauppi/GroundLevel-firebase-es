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

- great tools, selected for you
- background on the approaches taken (to be done in the Wiki)
- built on 2020's technology (ES6, async/await), aiming to stay up to date

Let's start! 🤾‍♀️

<!-- removed (we have a sticky start...)
<br/>

>It would be nice if you time your journey from here to a running installation. 
>Then let us know the time. ⏱
>
>|||
>|---|---|
>|1|9 minutes|
-->

## Requirements

- `npm`
- `firebase`
  - `npm install -g firebase-tools`

>💡 From time to time, run the `npm install -g firebase-tools` command again, to update the tools. Especially worth it if you run into problems.

<!--
Developed with Firebase 8.4.3 on macOS
-->

### Firebase project

You need to:

- create a Firebase project at the [Firebase console](https://console.firebase.google.com/)
  - enable hosting and authentication
  - you can choose the set of authentication providers you like
- `firebase login`
- `firebase use --add` to activate the project for this working directory

>Note: You don't need to use `firebase init` - that one is for creating a repo from scratch. `firebase use --add` is all that's needed.

There are two development workflows you can use, either directly to the cloud data or by using emulators, locally. In both ways you do need the Firebase project for user authentication.


## Getting started

Fetch dependencies:

```
$ npm install
```

>macOS Note: If you get `gyp: No Xcode or CLT version detected!` error, you can either ignore it or fix by:
>
>   ```
>   # trash `/Library/Developer/CommandLineTools`
>   $ xcode-select --install
>   ```

### Running tests

There are currently no UI side tests for the project. 😢

<!-- tbd. Once there are:
```
$ npm test
...  
```
-->

There are, however, Security Rules tests. They are organized separately in the `rules-test` folder. See the specific `README` in that sub-directory.


## Development workflow

```
$ npm run dev
...
vite v0.6.0
Dev server running at:
  > http://localhost:3000
...
```

Serves the project locally, reacting to source code changes. 

Try it out at [http://localhost:3000](http://localhost:3000). Sign in.

The code is served by [Vite](https://github.com/vuejs/vite) (GitHub). It renders changes to your sources on-the-fly (this is called Hot Module Replacement), speeding up development and experimentation. It's great! 

Try making some changes and see that they are reflected in the browser.


### Local mode: emulating the back-end

In the above workflow, front end is developed locally but the Firebase back-ends are run in the cloud.

When developing those back-end features - Firestore security rules or Cloud Functions - the work is better done locally. This speeds up the development loop (essentially providing Hot Module Replacement for back-end features), but also makes it less likely that you break the cloud project. Instead of treating it as a development playground, it can now be a staging deployment.

This matters even more, if you work as a group. Break things locally. 🔨

To run in local mode:

```
$ npm run dev:local

> groundlevel-es6-firebase-web@0.0.0 dev:local /.../Git/GroundLevel-es6-firebase-web
> firebase emulators:exec --only functions,firestore "vite --port 3001"

i  emulators: Starting emulators: functions, firestore
⚠  emulators: It seems that you are running multiple instances of the emulator suite for project vue-rollup-example. This may result in unexpected behavior.
⚠  Your requested "node" version "10" doesn't match your global version "14"
i  firestore: Firestore Emulator logging to firestore-debug.log
i  functions: Watching "/.../Git/GroundLevel-es6-firebase-web/functions" for Cloud Functions...
✔  functions[logs]: http function initialized (http://localhost:5001/vue-rollup-example/europe-west3/logs).
✔  functions[logs2]: http function initialized (http://localhost:5001/vue-rollup-example/europe-west3/logs2).
i  Running script: vite --port 3001
vite v0.20.8

  Dev server running at:
  > Local:    http://localhost:3001/
  > Network:  http://192.168.1.62:3001/
  > Network:  http://169.254.122.162:3001/

...
```

With local mode, authentication still happens online so you do need to have the Firebase project set up.

Data is not persisted. Once you stop the server and restart it, all your data is gone. This is intentional. If you wish to have a certain ground zero data available to start with, place it in `local.data.js`.

Here's a summary of the differences of normal and local mode:

||cloud based|local emulation|
|---|---|---|
|authentication|cloud|cloud|
|authorization|cloud|local|
|Cloud Firestore|cloud|local|
|Cloud Functions|cloud|local|
|persistence|yes|no|

### When to use emulation?

If you develop Cloud Functions, or Firestore access rules, it's easier to do this locally. It also means that your changes will not harm other developers as they would if you deployed work-in-progress to the cloud.

For a single developer, the faster feedback loop (no deployment to cloud) is likely enough to entice you to work locally - when working with functions and security rules.


## Testing Security Rules (optional)

If you are serious about development, have a look at the `rules-test` sub-project. It uses the Firestore emulator to check the rules we have in `firestore.rules` behave as intended.

Since this is quite an added complexity (more `npm` dependencies, need to install the emulator), it's been left as a self-sufficient sub-project.

Please see its [README](rules-test/README.md) file.

---

## Bring in your App!

This is where You can code.

We presume you have a suitable IDE, and know web programming (JavaScript, HTML, CSS). If you are new to programming, just study the existing code and tinker with it.

The code is under `src`. 

Three steps to brand your own app:

1. Please remove the `iconart` and `public/favicon*` files. They are not licensed for other use than this template. Thanks!
2. Change the `name`, `version` and `author` fields in `package.json`, to match your application.

<!-- hmm... wonder what was meant to be:
3. Change the `
-->

<!-- disabled (revise when we see whether we need Rollup)
If we still use Rollup, and you need CommonJS dependencies, enable `plugin-commonjs` in `rollup.config.js` and `package.json` (just uncomment or move around certain lines of code).
-->


## Production build

Once you've got your app together, you want to roll it out to the world. There are many ways, either manually or using a CI/CD pipeline.

>*We've not come to setting up CI/CD for this template, but that could be feasible. It's anyways best to start with a working, manual process, and doing CI/CD without tests is.. not a good idea. So, tests first.*

```
$ npm run build
...
```

>Note: The output bundle sizes shown on the console are not quite what's in the file system. #help

This builds a production mode front end under `dist/`.

To check it's working, we can serve it (don't try opening the `index.html` from the file system).

```
$ firebase serve --only hosting
```

><font color=red>BROKEN GLASS AHEAD!! Production build with Vite still needs work. The output (index.html) is broken!


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
- [ ] Cloud Firestore; creating an actual collaborative app behind the authentication
  - [ ] invitations
- [ ] Logging
- [ ] Performance monitoring
- [ ] A/B testing

Stay tuned for these developments, or chime in to make them happen!!! 🏅
-->

## Help needed!

If you wish to help, check out:

- [TODO.md](TODO.md)
- [Issues](https://github.com/akauppi/GroundLevel-es6-firebase-web/issues)

Issues has more formal definition of shortcomings and plans, and is the main forum of contributions and discussion. `TODO` is a shorthand for authors.

For a more permanent role, please check:

In particular:

- help to debug why after sign-in the "strager" page still flashes, instead of diving directly in
- [graphics designer](JOBS.md) is looked for!!!


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

<!-- enable once we have Typescript in
### Typescript

- [Configuring ESLint on a TypeScript project](https://www.jackfranklin.co.uk/blog/typescript-eslint/) (blog, Jan 2019)
- [Using Typescript with Vue Single File Components](https://www.digitalocean.com/community/tutorials/vuejs-using-typescript-with-vue)
-->