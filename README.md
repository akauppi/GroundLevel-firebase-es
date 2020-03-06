# GroundLevel ES6 * Firebase-web

[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src="iconart/logo_512x512.png" width=300 align="left" style="margin: 40px">

<br />
<br />

**A foundation for a web app, using Firebase suite of back-end tools.**

You want a web app and you want it now?

This aims to become the best place to make that happen. We chose and configured [great tools](Ingredients.md) so you don't need to read multiple manuals. We aim not only to show how it's done, but also argue why certain approaches were taken. We aim to start with 2020's technology (ES6, async/await), and stay relevant.

Welcome!

<br clear=all />
>⏱ Before we start, it would be nice if you can time your experience and tell us, how fast you got *your app* rolling. Data based metrics, you know.. 😉

<!-- Statistics reported so far:
9 mins: 1 user
-->

Let's start! 🤾‍♀️


## Requirements

- `npm`
- `firebase`
  - `npm install -g firebase-tools`

Note that we don't use Vue CLI. It's not strictly needed for creating or running a Vue project. Instead, we use rollup.js for building and Firebase Hosting for deployments.

### Firebase project

You need to:

- create a Firebase project
- enable hosting and authentication
  - you can choose the set of authentication providers you like
- `firebase login`
- `firebase use --add` to activate the project for this working directory

See [DEVS/Setting up the Firebase project](DEVS/Setting%20up%%20the%20Firebase%20project.md) for more details.

<!-- disabled 
>Note: `firebase use` when there's a cloned template like this; to create one you'd use `firebase init`.
-->


## Getting started

Fetch dependencies:

```
$ npm install
```

### Running tests

There are currently no tests for the project. 😢

<!-- tbd. Once there are:
```
$ npm test
...  
```
-->


## Development workflow

```
$ npm run dev
...
[firebase-serve] i  hosting: Serving hosting files from: public
[firebase-serve] ✔  hosting: Local server: http://localhost:3000
...
```

Serves the project locally, reacting to source code changes.

Try it out at [http://localhost:3000](http://localhost:3000). Sign in.

### Testing Security Rules (optional)

If you are serious about development, have a look at the `rules-test` sub-project. It uses the Firestore emulator to check the rules we have in `firestore.rules` behave as intended.

Since this is quite an added complexity (more `npm` dependencies, need to install the emulator), it's been left as a self-sufficient sub-project. At least for now.

You can run the rules-tests also by:

```
$ npm run rules-test
```

However, this expects that you have installed the necessary gear in the sub-project first. Please see its [README](rules-test/README.md) file.


## Bring in your App!

This is where You can code.

We presume you have a suitable IDE, and know web programming (JavaScript, HTML, CSS). If you are new to programming, just study the existing code and tinker with it.

The code is under `src`. 

Three steps to brand your own app:

1. Please remove the `iconart` and `public/favicon*` files. They are not licensed for other use than this template. Thanks!
2. Change the `name`, `version` and `author` fields in `package.json`, to match your application.
3. Change the `

### You need `npm` modules?

No problem.

If your modules provide ES6 exports, you may be able to use them, as is (let us know!). If they need `plugin-commonjs`, enable it in `rollup.config.js` and `package.json` (just uncomment or move around certain lines of code).

Maybe we should add an `npm` dependency, just to show how it works?


## Support

If you have suggestions or bugs, [GitHub Issues](https://github.com/akauppi/GroundLevel-firebase-web/issues) is the way. 

For general questions and casual chat, visit the project's [Gitter stream](https://gitter.im/akauppi/GroundLevel-firebase-web).

<!-- Editor's note:
Slack channel might be justified, but that's later.. (Asko)
-->


## Production build

Once you've got your app together, you want to roll it out to the world. There are many ways, either manually or using a CI/CD pipeline.

>*We've not come to setting up CI/CD for this template, but that could be feasible. It's anyways best to start with a working, manual process, and doing CI/CD without tests is.. not a good idea. So, tests first.*

```
$ npm run build
$ firebase serve
...
```

>Note: The output bundle sizes shown on the console are not quite what's in the file system. #help

The reason the output bundle can be pretty small (e.g. 8kB) is that Firebase, Firebase UI and Vue are brought in from CDN at `index.html`, instead of `npm`.

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


## Digging deeper...

The template aims to cover more ground. It's not enough to get authentication running. You need to manage the data behind your application. Firebase provides solutions to these, and it makes sense to show them in action.

This means:

- Firestore (planned); creating an actual collaborative app behind the authentication
- Performance monitoring
- Logging
- A/B testing

Stay tuned for these developments, or chime in to make them happen!!! 🏅


## Help needed!

If you wish to help, check out:

- [TODO.md](TODO.md)
- [Issues](https://github.com/akauppi/vue-rollup-example-with-firebase-auth/issues)

Issues has more formal definition of shortcomings and plans, and is the main forum of contributions and discussion. `TODO` is a shorthand for authors.

In particular:

- help from Vue and/or Rollup aficiados, to check the configs are Best in class ☺️

## Credits

Thanks to Jaakko Roppola for wonderful icon art!! 🙌

Thanks to Jonatas Walker for his [jonataswalker/vue-rollup-example](https://github.com/jonataswalker/vue-rollup-example) template. Based this work on it, then changed a few things.

<!-- things changed (easter egg):
- Jonatas's code is unlicensed. This is MIT licensed.
- Simplified `package.json` a bit
- updated dependencies
- `package-lock.json` disabled (just a matter of taste...)
- added `dev` target for "watch" workflow
- using `public` as the public folder (Firebase Hosting default)
- targeting "evergreen" ([ES6](https://caniuse.com/#search=ES6%20modules) and [async/await](https://www.caniuse.com/#search=await) capable) browsers; for IE11 support, see [here](https://github.com/akauppi/GroundLevel-firebase-web/issues/5)
-->

Thanks to Gaute Meek Olsen for his template and [associated blog entry](https://gaute.dev/dev-blog/vue-router-firebase-auth) (blog, Nov '19). This taught me how to use a Promise with `firebase.auth().onAuthStateChanged` properly.

   - btw. most material online gets that wrong. Using `firebase.auth.currentUser` in route guards is _not_ the correct way, and should be discouraged!


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
