# GroundLevel

<!-- not active; we're going for Discourd, #later
[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)
-->

<!-- CI Cloud Build badges: tbd.
- backend deployment of master
- app deployment of master

https://github.com/leg100/cloud-build-badge
-->

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src="branding/icon_512x512.png" width=300 align="left" style="padding-right: 3em">

**A modern (ES modules based and "Serverless") Web App template**

Great tools selected for you: 

[Vite](https://github.com/vitejs/vite)
- [Firebase](https://firebase.google.com)
- [Jest](https://jestjs.io)
- [Vue.js 3](https://v3.vuejs.org)
- [Cypress](https://www.cypress.io)
- [Cloud Build](https://cloud.google.com/build)
- [Sentry](https://sentry.io)

<!-- tbd. Add operational tools
-->

<font color=green>&check;</font> Built on 2020's technology (ES9, async/await), aiming to stay up to date and lean.

<font color=green>&check;</font> Covers all the way to deployment (CI/CD) and operations.

<br clear=all />

This repo is intended for professionals and beginners alike. Its main point is to showcase how easy, and effective, making web applications in the 2020's can be, when modern tools and techniques are used.

Much of starting a web app goes into setting up the frameworks. Especially so with modern (ES modules based) workflows, where online advice is still scarce and frameworks (such as Vite, Jest, and Node itself) have been growing fast. Apply this repo and you should be up, developing *your web app* already on the first day!

The repo is intended to *keep developing* and the author wants to find a way where you can track its changes to your app, as if the workflow itself were the dependency.

Finally, the repo has an emphasis on *operating* a real app. You can also see it as course material for modern web development. See [Training](TRAINING.md) if you are interesting in arranging an actual course.


## Pre-requisites and tools

To complete the "course" 🏌️‍♂️⛳️ you'll need:

- **A computer** with the following tools installed:

   - `node` 16+
   - `npm` - version 8+
   - `bash` and following command line tools: `sed`, `curl`, `grep`, `sort`
   - Docker Desktop [on Mac](https://docs.docker.com/docker-for-mac/install/) or [on Windows](https://docs.docker.com/docker-for-windows/install/) 

      Docker is used for launching the Firebase Emulators, deployments and building the CI/CD base image. The workflow we present always packs Firebase CLI inside a Docker container, so you don't need to install it on your development machine. <!-- This should also be somewhat safer since the Firebase credentials are not stored locally on developers' computers. -->
  
  For Windows development, we require [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) with an Ubuntu LTS image. WSL2 also happens to be a requirement for Docker Desktop for Windows.

<!-- tbd. write something once we do..  
  Once [WSLg](https://devblogs.microsoft.com/commandline/the-initial-preview-of-gui-app-support-is-now-available-for-the-windows-subsystem-for-linux-2/) (blog, Apr 2021) is publicly available, we'll use it in the front end testing (Cypress).
-->

   <details style="margin-left: 2em"><summary><b>Important note on file systems (Windows 10 + WSL2)</b></summary>
  The folder you clone the repo to *must reside within the WSL2 file system*. Docker performance is dismal if you link to (or directly use) `/mnt/c/` or the like. Don't. Instead create the folder within WSL2 and have the IDE tools reach it, remotely.
   </details>

   <details style="margin-left: 2em;"><summary><b>Linux</b></summary>
   Unlike with Windows and Mac, Docker Compose v2 is currently (Aug 2021) not integrated with Docker for Linux. This is no reason to wait, but you'll need to figure things out on your own, and maybe change some build files.

   See [Install Docker Compose](https://docs.docker.com/compose/install/#install-compose-on-linux-systems) > `Install Compose` > `Linux`
   
   Once [Docker Desktop for Linux (beta)](https://docs.docker.com/desktop/linux/) is stable, we'll consider recommending it. That would unify the developer experience.
   </details>
   
   <!-- tbd. Check situation of Docker Compose support on Linux. Revise the instructions when basic `docker` contains `docker compose` support. NOTE: There's a Job ad for this.
   -->
   
- **A capable IDE**

  An IDE (Integrated Debugger and Editor) is where you spend most of your time. Pick a good one. Learn to use it well. Here are some suggestions:
  
  - [WebStorm](https://www.jetbrains.com/webstorm/) - free 30 days trial, then € 59 / 47 / 35 /year
  - [Visual Studio Code](https://code.visualstudio.com) - free

- **Basic Knowledge** of:
  - HTML
  - JavaScript
  - CSS

  We use the ECMAScript features (up to ES2018) in the code, where-ever possible. Meaning no `var`, no `this` (ever!), yes `Promise`s and `async`/`await`. No Webpack. If you learn JavaScript from scratch, pay attention what year your material was made. Or just *dive in!* and learn from the code - the chef recommends this way!

  >Hint: [MDN resources](https://developer.mozilla.org) are a great place to learn the basics, and advanced material alike. Eg. [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) You might even have it in your native language! Check the ![Change language](.images/mdn-change-language.png) button.

- A **credit card** to deploy Cloud Functions

  While most Firebase features are free under the "Spark" plan, Cloud Functions require the "Blaze" plan since summer 2020.
  
  This might not be that bad.
  
  - you can still play with the emulators completely without a Firebase account
  - if your application doesn't need Cloud Functions, remove them
  - even if you use Cloud Functions, chances are *there aren't actual costs* since the Firebase free tiers are rather generous and apply to the "Blaze" plan as well.

Apropos, Firebase. What is it??


## Firebase

<a href="https://firebase.google.com"><img src="https://firebase.google.com/downloads/brand-guidelines/SVG/logo-logomark.svg" align="left" style="padding-right: 3em" /></a>

This repo uses the [Firebase](https://firebase.google.com) serverless framework for a lot of things: authentication, database, background functions, hosting.

Firebase allows a mere mortal to create fully functional cloud-based applications. You don't need to set up and maintain servers. You still have a "back end" but it's operated for you. You don't need to care about scalability (though you need to care about costs). Interface definitions become less burdensome than in traditional REST API world, since your front end deals directly with the database. Authentication and access rights management are integrated in the database (instead of a separate back end service you need to build).

>![](.images/backend-vs-firebase.png)

*Figure 1. Traditional microservice vs. Firebase approach <sub>[source](https://docs.google.com/drawings/d/15_rPDZDOCHwdL0RIX8Rg3Der1tb4mx2tMi9asQ_aegw)</sub>*

There are similar offerings from other companies, but they are a year or two behind (~ 2021), in the ease of use, based on the author's opinion.

<!-- hidden
>*This field is changing, though. [AWS Amplify](https://aws.amazon.com/amplify/?nc=sn&loc=0) offers a similar, but less tightly knit solution, based on GraphQL. [Supabase](http://supabase.io/) directly claims to be a Firebase alternative, based on PostgreSQL and an open source approach.*

The author is open to trying the approach with non-Firebase products, but they need to provide a 100% offline emulator experience, which Firebase does.
-->

<p />

>You *don't* have to know anything in advance about Firebase. However, some of their Youtube material is good and funny, start eg. with [Welcome to Firebase](https://www.youtube.com/watch?v=zHomxNDEJqY) (1:00). It's recommended to learn Firebase in parallel with using this repo.


### Google Cloud Platform

Firebase and Google Cloud Platform (GCP) have a relation. Firebase runs on top of GCP (and is owned by Google). They have separate dashboards, but some Firebase tasks require one to visit the GCP Console. When you create a Firebase project, a GCP project of the same name is also created (and is where your code really runs!).

We stay at the Firebase side of things most of the time, except CI/CD (Cloud Build) and operations.	

<!-- tbd. ^-- add mention of the GCP things we end up using in ops... Cloud Logging? -->

You'll be instructed about GCP where necessary. 

<!-- no, not really
>Both of the above mentioned services can be replaced, of course, if you already are familiar with certain CI/CD and have certain operational monitoring in place. But these make good defaults.
-->

## Folder structure

```
├── ci                   # all CI/CD setup
├── DEVS                 # notes about developing the repo (optional)
├── firebase-ci-builder.sub # sub-repo for the Docker image
├── first                # (tools for manual deployment)
└── packages
    ├── app              # front-end logic and looks
    └── backend          # Firestore Security Rules, Cloud Functions
```

The two `packages` and `ci` each contain their own documentation.


## Getting started

```
$ npm install
```

This installs some common tools, especially ESLint, used in multipla parts of the repo. Subpackages see them from the root, and this is where you update their versions.

Each of the subpackages has its own `npm install` that you'll run, for development. Follow the instructions in the particular `README`s.


### Update the submodules

We use a Docker image for running Firebase Emulators. The recipe for building this image comes from the [firebase-ci-builder](https://github.com/akauppi/firebase-ci-builder) repo and is linked here as a git submodule.

>Git submodules are a repo-within-a-repo. Once you initialize the submodules and `cd` to `firebase-ci-builder.sub`, you are no longer changing the GroundLevel repo. 
>
>This is very handy, but it's good to know what's going around. 
>
>Note: Using `.sub` postfix for submodules is just a convention for making explicit, where the repos change.

As a one-time thing, run these commands:

```
$ git submodule init
$ git submodule update
```

The `firebase-ci-builder.sub` folder is now populated. 


### Build the CI builder

<details style="border: 2px solid lightblue; padding: 0.4em;"><summary>Note to Windows users:</summary>
![](.images/defender-docker.png)
   
If you get this warning about Docker Desktop, at least
   
- **uncheck the "public networks" checkbox**. It's not needed.
   
It seems weird to the author that Windows would default to opening up things like that. Anyways, things continue to proceed in the background, regardless of what you select, but at least consider this.
</details>

```
$ (cd firebase-ci-builder.sub && ./build)
...
 => => naming to docker.io/library/firebase-ci-builder:10.6.0-node16-npm8
```

>*Note:* Did you use the parantheses in the command above? Without them, you'll end up in the `firebase-ci-builder.sub` folder. `cd ..` to climb back.

You don't need to push this image anywhere - it's enough that it resides on your development machine. The image is launched by the sub-packages whenever Firebase Emulators are required.

>You can test it:
>
>```
>$ docker run -it --rm firebase-ci-builder:10.6.0-node16-npm8 firebase --version
>10.6.0
>```


### Tour of the subpackages 🚌

The application is divided into subpackages, each having their own `README` and `npm install`.

We'll briefly mention them, as if shown from a bus window. To do the work, step out to each of the folders separately, study their contents and make changes.

>*'subpackage'* is an `npm` term (whereas *'submodule'* is a git term). It means a folder with its own `package.json` so you need to separately run `npm install` within it.


**`packages/backend`**

This folder has the Firebase back-end features:

- Firestore Security Rules describe your database's access rights
- Cloud Functions provide back-end functionality

We provide means to test these things. Deployment is done using CI/CD.

**`packages/backend/functions`**

A sub-subpackage, this folder runs Firebase Functions. It's only ever exercised from within the Firebase Emulators (Docker), or actual Google Cloud Functions environment in the cloud.


**`packages/app`**

This is where your web app lives.

The logic, the looks, the authentication. Everything that gets shipped to your customers once they open the right URL.

You can develop the code with Hot Module Reloading, thanks to Vite, seeing changes in a browser while you edit the underlying HTML, CSS or ECMAScript.

Once you're pleased, test the creature using Cypress.

<!-- REMOVE; tbd. mention about ops once it's there

This stage builds into a set of modules in `dist/` that are fed to the next stage. This approach is unconventional - the purpose is to separate application logic from operational details.
-->

### Create a Firebase project

This repo uses Firebase as your cloud presence. It:

- hosts your database
- runs server-side functions
- hosts the client-side files
- offers you a console to supervise the above

Follow the instructions in [Firebase](https://github.com/akauppi/GroundLevel-firebase-es/wiki/EN-0.1-firebase) (Wiki) to create your Firebase account and a project.

>You *will* need a credit card for creating the "Blaze" plan (which is needed for deploying the default back-end).



## First deployment

Have the Firebase project? Great! 🎉

You can now deploy the current contents of the repo manually, to be able to see the app online. It will take ~5 minutes.

The recommended way of deployment is with a CI/CD pipeline, but setting such up takes longer. You can start with manual deployments and move to CI/CD when you feel ready for the deeper plunge. 💧


### Manual deployment

Start the script:

```
$ npm run first
```

This starts a temporary Docker container and asks you to log into the Firebase project.

![](.images/first-1.png)
![](.images/first-2.png)

>Hint: On macOS, try Cmd (⌘)-double click on URLs in the terminal, to open them.

Did you reach the end?

>Note: Let us know if there were any problems (by filing a GitHub Issue). This stage just "need to get done", but it's not deserving too much of documentation space (thus the screen shots). Hope you made it!!!

**This may be your first deployment!**. Let's celebrate for a while!! 🎉🎉🎪🤹‍♀️🎺


---

### `firebase.staging.js`

In addition to deploying your application, the `first` scripts also fetched its *access values* (author's term) to a local file. Let's see it.

```
$ cat firebase.staging.js
export default {
  "projectId": ...,
  "appId": ...,
  "locationId": ...,
  "apiKey": ...,
  "authDomain": ...,
}
```

These values are needed in a couple of places in the repo:

|subpackage|command|purpose
|---|---|---|
|`app`|`npm run dev:online`|Developing against the online backend|
|`app-deploy-ops`|`npm run build`|Building the front-end|

Firebase hosting provides these values in the `__/firebase/init.js[on]` URL, but in GroundLevel we prefer to bake them right into the front-end's code. This takes away one return trip, and makes the launch of the web app snappier.

>The values are *not* secrets - anyone having access to your URL will be able to get them. Try with `https://<your-app>.web.app/__/firebase/init.json`.

You can have multiple deployment environments, and you can share the environments with your team by adding the file(s) into git. For more details on this, see [Staging](Staging.md).


## Setting up CI/CD

Eventually, we hope you'll like to move to automated deployment.

See [ci/README](ci/README.md) for instructions on how to set up a CI/CD pipeline.

This expects you to have a GitHub fork of the repo, and to want to use Cloud Build for running the CI/CD.

>Also other vendors provide cloud CI/CD. GitHub has one, and setting it up should be simpler than the dance needed to get two cloud services to collaborate. Cloud Build was selected because of the Firebase Google background, and because it allows Docker images to be used as build steps.


## Where to go next?

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

Check this documentation:

- [Living with Docker Compose](docs/Living%20with%20Docker%20Compose.md)

   Information that helps you be more effective with Docker Compose, which we use for running the Firebase Emulators.

- [Moving in!](docs/Moving%20in!.md)

   Instructions on what to consider when turning this repo to serve *your* needs. Removing the branding, mainly.

>We hope you are active also in the development - and giving feedback - of the GroundLevel repo. It doesn't serve its purpose unless it becomes the growing ground, a fertile soil, for many flowerful web apps! 
>
>🌷🌸🌼🌹🥀🌻🌾🌹🌺💐




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


