# GroundLevel ♠️ Firebase ♠️ ES modules

[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src="branding/icon_512x512.png" width=300 align="left" style="margin: 40px">

<br />

**A modern (ES modules based and "Serverless") Web App template**

- great tools selected for you: 
  - [Vue.js 3](https://v3.vuejs.org)
  - [Vite](https://github.com/vitejs/vite)
  - [Firebase](https://firebase.google.com)
  - [Jest](https://jestjs.io)
  - [Cypress](https://www.cypress.io)
  - [Cloud Build](https://cloud.google.com/build)
  - [Cloud Logging](https://cloud.google.com/logging/)
  - [Raygun](https://raygun.com)
- built on 2020's technology (ES9, async/await), aiming to stay up to date and lean
- covers all the way to deployment (CI/CD) and operations

<br clear=all />

This repo is intended for professionals and beginners alike. Its main point is to showcase how easy, and effective, making web applications in the 2020's can be, when modern tools and techniques are used.

The repo showcases a full social web app and has an emphasis on *operating* such an app. In this it deviates from most templates. You can also see it as course material for modern web development (see [Training](TRAINING.md) for courses).

## Pre-requisites and tools

To complete the "course" 🏌️‍♂️⛳️ you'll need:

- **A computer** with the following tools installed:

   - `node` v. 14.3+ or 16.x
   - `npm` - version 7.7 or later
   - `bash` and following command line tools: `sed`, `curl`, `grep`, `sort`
   - Docker Desktop (or Docker + Docker Compose for Linux)

  Docker is used for launching the Firebase Emulators, and building the CI/CD base image. The workflow we present always packs Firebase CLI inside a Docker container. This should be a degree safer than storing the Firebase credentials on one's development machine.
  
  For Windows development, we require [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) with eg. Ubuntu LTS image. WSL2 also happens to be a requirement for Docker Desktop.

<!-- not jinxing; write something once we do..  
  Once [WSLg](https://devblogs.microsoft.com/commandline/the-initial-preview-of-gui-app-support-is-now-available-for-the-windows-subsystem-for-linux-2/) (blog, Apr 2021) is publicly available, we'll use it in the front end testing (Cypress).
-->

   <details style="margin-left: 2em"><summary>**Important note on file systems (Windows 10 + WSL2)**</summary>
  The folder you clone the repo to *must reside within the WSL2 file system*. Docker performance is dismal if you link to (or directly use) `/mnt/c/` or the like. Don't. Instead create the folder within WSL2 and have the IDE tools reach it, remotely.
   </details>
  
   <details style="margin-left: 2em"><summary>**Installation of Docker Compose on Linux**</summary>
   There is no Docker Desktop for Linux. To install:
   
   - See [Install Docker Compose](https://docs.docker.com/compose/install/#install-compose-on-linux-systems) > `Install Compose` > `Linux`

   Note: Docker Compose is intended to be included also in normal Docker for Linux, by the end of 2021.
   </details>
   
   <!-- tbd. Check situation of Docker Compose support on Linux, towards end of 2021. Revise the instructions when basic `docker` contains `docker compose` support.
   -->
   
- **A capable IDE**

  An IDE (integrated debugger and editor) is where you spend most of your time. Pick a good one. Learn to use it well. Here are some suggestions:
  
  - [Visual Studio Code](https://code.visualstudio.com) - free
  - [WebStorm](https://www.jetbrains.com/webstorm/) - free 30 days trial, then € 59 / 47 / 35 /year

- **Basic Knowledge** of:
  - HTML
  - JavaScript
  - CSS

  We use the ECMAScript features (up to ES2018) in the code, where-ever possible. Meaning no `var`, no `this` (ever!), yes Promises and `async`/`await`. No Webpack. If you learn JavaScript from scratch, pay attention what year your material was made. Or just *dive in!* and learn from the code - the chef recommends this way!

  >Hint: [MDN resources](https://developer.mozilla.org) are a great place to learn the basics, and advanced material alike. Eg. [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) You might even have it in your native language! Check the ![Change language](.images/mdn-change-language.png) button.

- A **credit card** to deploy Cloud Functions

  While most Firebase features are available in the free "Spark" plan, Cloud Functions require the "Blaze" plan since summer 2020.
  
  This might not be that bad.
  
  - you can still play with the emulators completely without a Firebase account
  - if your application doesn't need Cloud Functions, remove them and deploy
  - even if you use Cloud Functions, chances are *there aren't actual costs* since the Firebase free tiers are rather generous and apply to the "Blaze" plan as well.

Apropos, Firebase. What is it??


## Firebase

<a href="https://firebase.google.com"><img src="https://firebase.google.com/downloads/brand-guidelines/SVG/logo-logomark.svg" align="left" style="padding: 1em" /></a>

This repo uses the [Firebase](https://firebase.google.com) serverless framework for a lot of things: authentication, database, background functions. <!--, performance monitoring. tbd. -->

Firebase allows a mere mortal to create fully functional cloud-based applications. You don't need to set up and maintain servers. You still have a "back end" but it's operated for you. You don't need to care about scalability (though you need to care about costs). Interface definitions become less burdensome than in traditional REST API world, since your front end deals directly with the database. Authentication and access rights management are integrated in the database (instead of a separate back end service you need to build).

>![](.images/backend-vs-firebase.png)

*Figure 1. Traditional microservice vs. Firebase approach <sub>[source](https://docs.google.com/drawings/d/15_rPDZDOCHwdL0RIX8Rg3Der1tb4mx2tMi9asQ_aegw)</sub>*

There are similar offerings from other companies, but they are a year or two behind, in the ease of use, based on the author's opinion.

>*This field is changing, though. [AWS Amplify](https://aws.amazon.com/amplify/?nc=sn&loc=0) offers a similar, but less tightly knit solution, based on GraphQL. [Supabase](http://supabase.io/) directly claims to be a Firebase alternative, based on PostgreSQL and an open source approach.*

<p />

>Note: You *don't* have to know anything in advance about Firebase. But their educational material is good and fun (Youtube, especially!). It's recommended to check those out in parallel with this repo.


### Google Cloud

Firebase and Google Cloud Platform (GCP) have a relation. Firebase runs on top of GCP (and is owned by Google). They have separate dashboards, but some Firebase tasks require one to visit the GCP Console. When you create a Firebase project, a GCP project of the same name is also created (and is where your code really runs!).

We stay at the Firebase side of things most of the time, exceptions being CI/CD (Cloud Build) and central logging (Cloud Logging).

You'll be instructed about GCP where necessary. 

>Both of the above mentioned services can be replaced, of course, if you already are familiar with certain CI/CD and have certain operational monitoring in place. But these make good defaults.

## Folder structure

```
├── ci       # all CI/CD setup
├── DEVS     # notes about developing the repo (optional)
├── firebase-ci-builder.sub   # sub-repo for the Docker image
├── hack     # needed until Firebase fixes one thing
├── packages
│   ├── app
│   ├── app-deploy-ops
│   └── backend
└── tools    # common scripts to the `packages`
```

The three `packages` and `ci` each contain their own documentation.


## Getting started

```
$ npm install
```

This installs some common packages, Firebase JS SDK being the most important. Subpackages use them from the root, and this is where you update their versions.

### Build the Docker image

We use a Docker image for running Firebase Emulators. Before advancing, let's build that image.

```
$ git submodule init
$ git submodule update
```

This updates the contents of `firebase-ci-builder.sub` submodule.

Build:

```
$ (cd firebase-ci-builder.sub && ./build)
...
 => => naming to docker.io/library/firebase-ci-builder:9.16.0-node16-npm7 
```

>*Note:* Did you use the parantheses in the command above? Without them, you'll end up in the `firebase-ci-builder.sub` folder. `cd ..` to climb back.

You don't need to push this image anywhere - it's enough that it resides on your development machine. The image is launched by the sub-packages whenever Firebase Emulators are required.

>You can test it:
>
>```
>$ docker run -it --rm firebase-ci-builder:9.16.0-node16-npm7 firebase --version
9.16.0
>```

## Speed run 

If you continue here, we'll do a real speed run 🏃‍♀️🏃🏃‍♂️
through the three sub-packages, set up a Firebase project (and account), CI/CD to Cloud Build and land on a discussion about operating your newly dispatched web app.

Alternatively, you can study each of the individual sub-packages' `README`s (and `ci` and `ops`) and come back here later..


### Backend

```
$ cd packages/backend
$ npm install
...
$ npm test
...
```

The tests should pass, running against the Docker image you built.

><details><summary>Note to Windows users:</summary>
>
>![](.images/defender-docker.png)
>   
>If you get this warning about Docker Desktop, at least
>   
>- **uncheck the "public networks" checkbox**. It's not needed.
>   
>It seems weird to the author that Windows would default to opening up things like that. Anyways, things continue to proceed in the background, regardless of what you select, but at least **do not press OK** without removing that one checkbox.
></details>


### App

```
$ cd ../app
$ npm install
...
$ npm run build
...
```

The output of this stage (in `dist/`) *is* the web app. All the looks, styling and front end features are done here.

What's missing is the operational readiness that adds performance monitoring, central logging and crash detection to the app.

>Note: The front end has tests, but we skip them for now. See `packages/app/README.md` for more details.


### App-deploy-ops

This sub-package wraps the output of the "app" build to be ready for deployment.

Before you can build the production-ready front end, the backend code needs to be deployed to a "staging" Firebase project. Follow [these instructions](Deployment%20to%20staging.md) for doing it.

This creates a `firebase.staging.js` file in the repo's root, containing the access values for reaching a Firebase instance deployed online.

>You can use multiple "staging" projects, if you like. Just define an environment variable `ENV` with the name of the environment. This can be useful for eg. a beta testers project (`"testers"`), an internal team sandbox (`"team"`) etc.

```
$ cd ../app-deploy-ops
$ npm install
...
$ npm run build
...
```

There are no tests here.

The folder's `README` contains information on how to do a manual deployment to the staging project. However, we proceed with the real thing - setting up CI/CD that deploys ready code, on your behalf!


## Setting up CI/CD

Production deployments are intended to be done using CI/CD.

See [ci/README](ci/README.md) for instructions on how to set up a CI/CD pipeline.

This expects you to have a GitHub fork of the repo, and to want to use Cloud Build for running the CI/CD.

>Also other vendors provide cloud CI/CD. GitHub has one, and setting it up should be simpler than the dance needed to get two cloud services to collaborate. Cloud Build was selected because of the Firebase Google background, and because it allows Docker images to be used as build steps.


### Trying your deployment

Once you have the CI/CD deployment running, visit the application's web site:

e.g. [https://&lt;your-project&gt;.web.app](https://your-project.web.app)


## Where to go next?

You now have an application running in the cloud!!!

Make changes to it, push those changes as a PR and see GitHub and Cloud Build approve or reject your changes.

If you merge them to `master`, they'll show up in the deployed project. Great!

What remains is:

- Getting an audience!  How to publicize your application; how to get users to it.
- Creating the app 😐

Check these subfolders:

- 🖌📐 Backend: [`packages/backend`](packages/backend/README.md)
- 💅 Front-end: [`packages/app`](packages/app/README.md)
- 🦾 Front-end operational readiness: [`packages/app-deploy-ops`](packages/app-deploy-ops/README.md)
- 🌀 CI/CD ([`ci/`](ci/README.md))

<!-- #later
- 📈 Operational monitoring and improvements ([`ops/`](ops/README.md)) (⚠️ work-in-progress)
- Growing with your user base ([`grow/`](grow/README.md)) (just-an-idea)
-->

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

We don't mind you keeping the reference, but many `.md` files likely deserve to be removed/edited. That command helps you find the mentions.

You *may* mention in your docs that the app was based on GroundLevel, but are not required to do so. See the [LICENSE.md](LICENSE.md).

Apropos, the License. 

You may now remove the top part of it:

>This license applies to the software (contents of the GitHub repo), except
graphic art.
>
>In particular:
>
>- `branding/*`
>- symbolic links to `branding`
>
>Those files are PROPRIETARY to this project, and not to be used in other circumstances.
>You may, however, create a fork of this GitHub repo and continue working with the graphic
>files. Forks are regarded as just a way to collaborate and contribute, for the sake of
>the project itself.
>
>For the rest of the repo (code, configs and textual documentation), this applies:
>...

### Follow the letter of the license

Notice that the license states:

>The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

ie. do not remove the license. You may, of course, become active in further developing the app template and we'd like to hear if you use it.


<!-- hide/remove? (looks more pro without it)
## Plans 🪐🧳

What the repo *mostly* needs is people to use it. To test its usefulness. To bend it.

You can help by using the repo, giving feedback, and telling others about it!

---

Since the Issues will be unnecessarily flooded at some point, here are two major tasks that the author would like to finish:

- [ ] using git subpackages to *detach the app from the template*

   This would allow you to keep pulling updates of the template, yet not be bothered that your application code is affected by them, in any way.
   
   In short, `packages/backend` and `packages/app` would be replaced by subpackages that you provide.
   
   We're trying this out, once interested parties volunteer. :)

- [ ] `ops/**`

   Once the `app-deploy-ops` part is finished, information about what to consider in operations will be added in `ops/` (a documentation folder).

---
-->

## Credits

Thanks to:

- Jaakko Roppola for wonderful icon art!! 🙌

- Jonatas Walker for his [jonataswalker/vue-rollup-example](https://github.com/jonataswalker/vue-rollup-example) template. Based this work on it (in 2019), then changed a few things.

- Gaute Meek Olsen for his template and [associated blog entry](https://gaute.dev/dev-blog/vue-router-firebase-auth) (Nov '19). This taught me how to use a Promise with `firebase.auth().onAuthStateChanged` properly.


## Contribution

As always, contributions and discussions are welcome.

- Please use primarily [GitHub Issues](https://github.com/akauppi/GroundLevel-es-firebase/issues) for questions and bug reports.
- For casual conversation, head to the [Gitter](https://gitter.im/akauppi/GroundLevel-firebase-web).

*We'll move to a Discord server, once more people are involved.*

Have Fun, and spread the word!!


## References

### Serving ES6 modules, HTTP/2 etc.

- [Using Native JavaScript Modules in Production Today](https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/) (blog, Aug 2019)
   - this step-by-step guidance was instrumental in making the production build work with ES modules. Brilliant write!!! 💎

### Other app templates

- [Firelayer](https://firelayer.io)
  - seems visually pleasing!
  - likely Vue.js 2?
  - likely uses bundling

- [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app)
  - Showcasing use of Cypress

*tbd. When someone has checked Firelayer in detail, and can make a brief (2 sentence!) summary on how it differs from this repo, that is a welcome `#contribution`!*

### Online forums

- [Firebase developers](https://discord.gg/BN2cgc3) (Discord server)


