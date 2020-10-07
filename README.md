# GroundLevel ♠️ ES modules ♠️ Firebase

[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src=".images/icon_512x512.png" width=300 align="left" style="margin: 40px">

<br />

**A modern (ES modules based) Web App template**

- great tools selected for you: [Firebase](https://firebase.google.com), [Vue.js 3](https://v3.vuejs.org), [Vite](https://github.com/vitejs/vite), [Rollup](https://rollupjs.org/guide/en/), [Jest](https://jestjs.io), [Cypress](https://www.cypress.io)
- built on 2020's technology (ES9, async/await), aiming to stay up to date

<br clear=all />

This repo is intended for professionals and beginners, alike. Its main point is to showcase how easy, and effective, making Web Applications in the 2020's is, when (only) modern tools are used.


## Easy for beginners

One learns best by reading other people's code. Actual code. This template is made with that in mind. It's not a partial template, and doesn't create a to-do list.

There's going to be a [narrative](...) that discusses the design choices done. For a beginner it's important to know what could have been done differently, and why the approach was selected.

For medium and pro level software engineers, you should still get something out of this. The project features e.g.

- social invites
- collaboration
- interactive SVG graphics (tbd.)
- testing
- production builds
- operations / metrics

This hopefully makes the app not only easy, but interesting as well.

<!--
We also cover testing, production build and operations. This is in contrast to app templates that just show you the app but not how you'd keep it running healthy for a longer time span.
-->

But let's cut the chace and get started! 😀



## Firebase

<img src="https://firebase.google.com/downloads/brand-guidelines/SVG/logo-logomark.svg" align="left" style="padding: 1em" />

This repo uses the Firebase serverless framework for a lot of things: authentication, background functions, data storage, operational monitoring.

Firebase allows a mere mortal to create fully functional cloud-based applications. You don't need to set up and maintain servers. You still have a "back end" but it's operated for you. You don't need to care about scalability (though you need to care about costs). Interface definitions become less burdensome than in traditional REST API / GraphQL world, since your front end deals directly with the database, also handling authentication and access rights management.

>![](.images/backend-vs-firebase.png)

*Figure 1. Traditional cloud vs. Firebase approach <sub>[source](https://docs.google.com/drawings/d/15_rPDZDOCHwdL0RIX8Rg3Der1tb4mx2tMi9asQ_aegw)</sub>*

There are similar offerings from other companies, but they are years behind, in the ease of use, based on the author's opinion.

>Note: You *don't* have to know anything in advance about Firebase. But their educational material is good and fun. It's recommended to check those out in parallel with this repo.

There are links to Firebase resources at the [References](#References).

<!-- tbd. check whether the link works in GitHub -->


## Requirements

- `npm`
- `firebase`

  ```
  $ npm install -g firebase-tools
  ```

You should use `firebase-tools` >= 8.11.1.

>💡 From time to time, run the `npm install -g firebase-tools` command again, to update the tools. Especially worth it if you run into problems.

The repo is developed with latest `firebase` (8.11.1) and Node.js (14.12.0) on macOS.


## Getting started

Fetch dependencies:

```
$ npm install
```

This brings in a sample application from another repo: [GroundLevel-es-firebase-app](https://github.com/akauppi/GroundLevel-es-firebase-app). The development happens there, whereas the repo you are now looking at is responsible for "B&O" (build and ops) - placing the app to production.

There's also a third repo [GroundLevel-es-firebase-backend](https://github.com/akauppi/GroundLevel-es-firebase-backend) for back-end implementation, testing and also deployment.

We'll come to these later. For now, the aim is to get the application deployed, under your Firebase account. Then we'll look into development and making changes.

Having three repos simplifies the setup, e.g. `package.json` files become less cluttered.


### Set up a Firebase project

- Create a project in the [Firebase console](https://console.firebase.google.com/)
   - enable hosting, authentication, Cloud Firestore and Cloud Functions
   - create an app (needed for authentication)
   - choose the set of authentication providers you like (Google, anonymous recommended)
- Tie your local CLI to your project:
   
   ```
   $ firebase use --add 
   ```
   
   The alias you choose doesn't really matter. `"abc"` is okay.
   
This creates the file `.firebaserc`. You can now use the project from `firebase` command.
   
<!-- Editor's note:
This is left rather low (not in 'Requirements') so that the reader would get a faster fulfilling feeling (thinking `npm install` is more fulfilling than setting up Firebase project).
-->   


### No tests

The build & ops repo does not have tests.

- Your application repo is responsible for front-end testing.
- Your back-end repo is responsible for back-end testing.

Next, let's build the front-end for production and deploy it.


## Production build

```
$ npm run build
...
688	public/dist
0	public/hack
720	public
```

This uses Rollup to build the sample app for good tightness. The final numbers indicate the size of your application, in kB.

>Note: In addition, there is a `stats.html` file generated that shows the contents of the output in detail.

But... it's more fun to RUN an application! Unfortunately, this means we must take a side tour to the back end repo in order to have the back end deployed.

### Deploying the back end [side kick]

In another folder:

```
$ git checkout git@github.com:akauppi/GroundLevel-es-firebase-backend.git

$ cd GroundLevel-es-firebase-backend

$ open README.md

$ firebase use --add    # select your project

$ firebase deploy --only functions,firestore
```

That should do it! You can dwell more in the back end repo later, but now let's surface back to the B&O (build & ops) repo since we can run the front end, locally.

### Running the production build, locally

```
$ npm run serve
...
i  hosting: Serving hosting files from: public
✔  hosting: Local server: http://0.0.0.0:3012
```

Open [localhost:3012](http://localhost:3012) and you should see something like:

>![](.images/app.png)

You can try the application. It should work against the back-end of the Firebase project you created, storing data there. Close and re-open the browser. You should be able to see your data.


## Deploying front-end

The front-end you were using was still running locally. Let's get also it online.

```
$ firebase deploy --only hosting
...

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT/overview
Hosting URL: https://YOUR_PROJECT.web.app
```

That's it. You should now be able to reach your application at the given URL (`https://YOUR_PROJECT.web.app`).


---

Next: [Make it Yours](README.2-yours.md)

<!--
## Next steps

- [Make it Yours](README.yours.md)
   - How to edit the application front-end and back-end, to make the app Yours. 😀
- [Operations](README.operations.md)
- [Design approaches](README.design.md)
   - Discussion on the decisions taken and how you can do things differently.
- [Credits and References](README.credits.md)
   - Credits to people who've helped in the project and references to further reading.
-->