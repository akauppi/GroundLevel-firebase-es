# GroundLevel ♠️ Firebase ♠️ ES modules

[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src="branding/icon_512x512.png" width=300 align="left" style="margin: 40px">

<br />

**A modern (ES modules based) Web App template**

- great tools selected for you: [Vue.js 3](https://v3.vuejs.org), [Vite](https://github.com/vitejs/vite), [Firebase](https://firebase.google.com), [Jest](https://jestjs.io), [Cypress](https://www.cypress.io), web components [with Svelte 3](https://dev.to/silvio/how-to-create-a-web-components-in-svelte-2g4j), [Cloud Build](https://cloud.google.com/build), [Cloud Logging](https://cloud.google.com/logging/)
- buildable with [Jailed!](https://github.com/akauppi/Jailed); no need to expose one's development maching to all those `npm` dependencies
- built on 2020's technology (ES9, async/await), aiming to stay up to date and lean
- covers all the way to deployment (CI/CD) and operations

<br clear=all />

><font size="+5">🪤</font> Calling something "modern" seems to be a subjective term (always is). If you think "[Angular, React and Vue" are modern](https://stackoverflow.blog/2021/02/24/what-i-wish-i-had-known-about-single-page-applications/) (in 2021), maybe "post-modern" is a more appropriate term for this repo.

This repo is intended for professionals and beginners alike. Its main point is to showcase how easy, and effective, making Web Applications in the 2020's is, when (only) modern tools are used.


<!-- too much???
## Easy for beginners

We learn by reading other people's code. Actual code. This template is made with that in mind. It's not a partial template, and doesn't create a to-do list.

<!_-- tbd.
There's going to be a [narrative](...) that discusses the design in more detail. --_>

For medium and pro level software engineers, you should still get something out of this. The project features e.g.

- social invites
- collaboration
- interactive SVG graphics
- testing
- production builds
- CI/CD setup
- operations / metrics

This hopefully makes the app not only easy, but interesting as well.

But let's cut the chase and get started! 😀

>Note: Many of the features are still pending (the sample itself has become the *last* thing to finish!). Don't let that discourage yourself - head further and see whether dragons lie there! <font size="+5">🐉</font>
-->

## Firebase

<a href="https://firebase.google.com"><img src="https://firebase.google.com/downloads/brand-guidelines/SVG/logo-logomark.svg" align="left" style="padding: 1em" /></a>

This repo uses the [Firebase](https://firebase.google.com) serverless framework for a lot of things: authentication, database, background functions, performance monitoring.

Firebase allows a mere mortal to create fully functional cloud-based applications. You don't need to set up and maintain servers. You still have a "back end" but it's operated for you. You don't need to care about scalability (though you need to care about costs). Interface definitions become less burdensome than in traditional REST API / GraphQL world, since your front end deals directly with the database. Authentication and access rights management are integrated in the database (instead of a separate back end service you need to build).

>![](.images/backend-vs-firebase.png)

*Figure 1. Traditional microservice vs. Firebase approach <sub>[source](https://docs.google.com/drawings/d/15_rPDZDOCHwdL0RIX8Rg3Der1tb4mx2tMi9asQ_aegw)</sub>*

There are similar offerings from other companies, but they are a year or two behind, in the ease of use, based on the author's opinion.

>Note: You *don't* have to know anything in advance about Firebase. But their educational material is good and fun. It's recommended to check those out in parallel with this repo.


## Google Cloud

Firebase and Google Cloud have a relation. Firebase runs on top of Google Cloud (and is owned by Google). They have separate dashboards, but some Firebase tasks require one to visit the Google Cloud tools side.

We stay at the Firebase side of things most of the time, exceptions being CI/CD (Cloud Build) and central logging (Cloud Logging).

You'll be instructed about Google Cloud where necessary, and both of the above mentioned services can be replaced by others, of your choice (but you'll need to make the necessary changes).

## Requirements

As global tools, you will need:

- `npm`
- `firebase` CLI (Command Line Interface)

  ```
  $ npm install -g firebase-tools
  ```

>💡 From time to time, run the `npm install -g firebase-tools` command again, to update the tools. Especially worth it if you run into problems.

<!--
### OS support

The project is developed on macOS.
-->

<!-- too hand holding (to separate narration, for beginners)
### An editor

You need an editor for seeing and modifying the code. 

- [WebStorm](https://www.jetbrains.com/webstorm/) (€ 59 -> 47 -> 35 per year for individual use with [discounts / free licenses for selected groups](https://www.jetbrains.com/webstorm/buy/#discounts?billing=yearly))
- [Visual Studio Code](https://code.visualstudio.com)

*Please suggest other IDEs you feel are good for a newcomer. Oldtimers likely won't convert, anyhow. ;)*
-->

<!-- tbd.
### Big enough screen

In programming, the more you can see on the screen at once, the better. The author is very pleased with a single 4K screen, while others use multiple displays. Don't try to cram your vision to an old HD monitor - at least have two. It's like tunnel vision with eye glasses.
-->


## Getting started

If you are mostly interested in UI development, and don't want to create a Firebase project just yet, go to the `packages/app` directory and see its `README.md`.

If you continue here, we'll do a real speed run 🏃‍♀️🏃🏃‍♂️
through the tree subpackages, and end up having a clone of the sample application installed *on your Firebase account*, in the cloud. 

---


<!-- disabled
<img width="180px" align=left src=".images/y-sign.png" style="padding: 1em" />

There's a choice you need to make. 

Are you more interested in:

<font color=green>🅐</font> - [Run for the Cloud](#choice-a)<br />
<font color=lilac>🅑</font> - [UI development, first](#choice-b)

<br clear=all />

<a name="choice-a"></a>
### <font size="+3" color=green>🅐</font> - Run for the Cloud

With this route, we'll sign you up to Firebase "blaze" plan and create a project. Then proceed to build and deploy the application online, without making any changes to it, yet.

After the application works, you can look into the various parts of it and start making changes.

---

There are three subpackages in the repo: `backend`, `app` and `app-deploy-ops`. In this tour, we are visiting them all. For more details on each one of them, check their particular `README` files.

-->

### Create a Firebase project

Follow the instructions in [README.firebase.md](./README.firebase.md) so that you have a Firebase project created.

You *will* need a credit card for creating the "Blaze" plan. If you don't want to do that yet, choose the free plan and continue as far as you can. 👍

---

Okay, have the Firebase project? Let's check in.

```
$ firebase use --add
```

Select the project you want to use and give it an alias. The alias doesn't really matter, `abc` is just fine..

Now, you should be able to see your selected project:

```
$ firebase use
Active Project: testing-220321
...
```

<!-- tbd. Here could be a step to distribute the check-in to subpackages:
./tools/check-em-all.sh

- copy '.firebaserc' (no links needed) and 
- modify the state file 
-->


The repo has three subpackages:

- `packages/backend`
- `packages/app`
- `packages/app-deploy`

At the moment, each one of these needs to be activated separately, for Firebase. We're [considering](https://github.com/akauppi/GroundLevel-firebase-es/issues/41) making this easier for you. It's like a hotel with three separate check-in counters. That would be strange, right?


### Back-end: build and deploy

```
$ cd packages/backend
```

```
$ firebase use --add
```

Next, we'll install the dependencies and deploy the database access rules and Cloud Functions:

```
$ npm install
```

```
$ npm run deploy
...

=== Deploying to 'testing-220321'...

i  deploying firestore, functions
i  firestore: reading indexes from ./firestore.indexes.json...
i  cloud.firestore: checking ./firestore.rules for compilation errors...
✔  cloud.firestore: rules file ./firestore.rules compiled successfully
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
✔  functions: required API cloudbuild.googleapis.com is enabled
✔  functions: required API cloudfunctions.googleapis.com is enabled
i  functions: preparing ./functions directory for uploading...
i  functions: packaged ./functions (32.02 KB) for uploading
✔  firestore: deployed indexes in ./firestore.indexes.json successfully
i  firestore: latest version of ./firestore.rules already up to date, skipping upload...
✔  functions: ./functions folder uploaded successfully
✔  firestore: released rules ./firestore.rules to cloud.firestore
i  functions: updating Node.js 14 (Beta) function userInfoShadow_2(europe-west6)...
i  functions: updating Node.js 14 (Beta) function logs_1(europe-west6)...
✔  functions[userInfoShadow_2(europe-west6)]: Successful update operation. 
✔  functions[logs_1(europe-west6)]: Successful update operation. 
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/testing-220321/overview
```

If you saw that, the backend is now ready in the cloud. Well done!

You can visit the given URL to see the dashboard. Check the `Firestore` and `Functions` pages.

Next, we'll prepare the front end and deploy it as well.

### Front end: build

```
$ cd ../app
```

Do again the `firebase use`:

```
$ firebase use --add
```

```
$ npm install
```

The web app needs to be built.

```
$ npm run build
...
vite v2.1.2 building for production...
✓ 47 modules transformed.
dist/aside-keys.js   17.85kb / brotli: 5.62kb
dist/aside-keys.js.map 28.60kb
dist/style.css       5.21kb / brotli: 1.45kb
dist/app.es.js       35.40kb / brotli: 8.86kb
dist/app.es.js.map   72.08kb
dist/vue-router.js   51.80kb / brotli: 11.50kb
dist/vue-router.js.map 169.41kb
dist/vue.js          127.87kb / brotli: 25.31kb
dist/vue.js.map      465.31kb
```

What we now have is the web app's *logic*. It is not ready for deployment, yet. We'll handle that next.

### Front end: deploy

>Note: In this repo, developing and packaging the app for deployment are separated. This is not a normal pattern but has its benefits: separation of concerns, allows different teams to have ownership of the features vs. how those features are operated in the cloud.

```
$ cd ../app-deploy-ops
```

You know the drill:

```
$ firebase use --add
```

```
$ npm install
```

```
$ npm run build
```

This build used the previously built *app logic* and wrapped it with code involved in running an app on the cloud.

The build *does not* run the app build (you could change that pretty easily); you'd go to the `packages/app` to build and test changes there, then come back here for deploying them. 

In practise, CI/CD takes care of such details, but that's the last thing we'll cover. 🙂

```
$ npm run deploy
...

=== Deploying to 'testing-220321'...

i  deploying hosting
i  hosting[groundlevel-160221]: beginning deploy...
i  hosting[groundlevel-160221]: found 3 files in roll/out
✔  hosting[groundlevel-160221]: file upload complete
i  hosting[groundlevel-160221]: finalizing version...
✔  hosting[groundlevel-160221]: version finalized
i  hosting[groundlevel-160221]: releasing new version...
✔  hosting[groundlevel-160221]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/testing-220321/overview
Hosting URL: https://testing-220321.web.app
```

Now, head to the provided URL and you should see the app alive and kicking!!! 👶

Have a go with it!

---

As you can imagine, there are *tons* of details around each of the phases we took. 

We didn't touch testing at all (backend and front end have tests).

..but the purpose was to get you from 0 to cloud as fast as possible, and hopefully that happened!


## Where to go next?

You have some options. 

If you pick one, come back for the rest later. It doesn't really matter, in which order you cover these, but it would be useful to cover them all.

- Backend development ([`packages/backend`](packages/backend/README.md))

  All the cloud services that your front end relies on: database, server-side functions, data models and access rights of the stored data.

- Front-end development ([`packages/app`](packages/app/README.md))

  Developing the front end. You can do this without a Firebase project.
  
- Front-end deployment ([`packages/app-deploy-ops`](packages/app-deploy-ops/README.md))

  Deploying the front end, with a logging adapter attached.

- CI/CD ([`builds/`](builds/README.md))

  Making sure PRs don't break the code; deploying code that gets merged to `master`.

- Operations ([`ops/`](ops/README.md))

  Advice on what to do once the app is out.


## Making it yours!

By now, you have deployed the sample app to your own Firebase project. It's now an independent *instance* of that application, unattached to the one run by the original authors.

Once you start making heavier modifications - that's why the repo exists, it's intended as a "ground level" of your spectacular app! - we hope that you remove the "GroundLevel" branding. Do so:

```
$ git rm -rf branding 
```

```
$ git grep GroundLevel
...
```

We don't mind you keeping the reference, but many `.md` files likely deserve to be removed/edited, for your app. That command helps you find the mentions.

You *may* mention in your docs that the app was based on GroundLevel, but are not required to do so. See the [LICENSE.md](LICENSE.md).

Apropos, the License. 

You may now remove the top part of it:

>This license applies to the software (contents of the GitHub repo), except
graphic art.
>
>In particular:
>
>- `branding/*`
>- `**/public/favicon.*`
>
>Those files are PROPRIETARY to this project, and not to be used in other circumstances.
>You may, however, create a fork of this GitHub repo and continue working with the graphic
>files. Forks are regarded as just a way to collaborate and contribute, for the sake of
>the project itself.
>
>For the rest of the repo (code, configs and textual documentation), this applies:
>...

Live Long and Prosper! 

🛸🪐



# Credits

Thanks to Jaakko Roppola for wonderful icon art!! 🙌

Thanks to Jonatas Walker for his [jonataswalker/vue-rollup-example](https://github.com/jonataswalker/vue-rollup-example) template. Based this work on it, then changed a few things.

Thanks to Gaute Meek Olsen for his template and [associated blog entry](https://gaute.dev/dev-blog/vue-router-firebase-auth) (Nov '19). This taught me how to use a Promise with `firebase.auth().onAuthStateChanged` properly.

Thanks to [Bootstrap Icons](https://icons.getbootstrap.com/) for SVG icon art.



# References

### Serving ES6 modules, HTTP/2 etc.

- [Using Native JavaScript Modules in Production Today](https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/) (blog, Aug 2019)
   - this step-by-step guidance was instrumental in making the production build work with ES modules. Brilliant write!!! 💎

### Other app templates

- [Firelayer](https://firelayer.io)
  - seems visually pleasing!
  - likely Vue.js 2?
  - likely uses bundling

*tbd. When someone has checked Firelayer in detail, and can make a brief (2 sentence!) summary on how it differs from GroundLevel, that is a welcome #contribution!*

### Online forums

- [Firebase developers](https://discord.gg/BN2cgc3) (Discord server)

