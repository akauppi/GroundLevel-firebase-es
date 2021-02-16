# GroundLevel ♠️ ES modules ♠️ Firebase

[![Join the chat at https://gitter.im/akauppi/GroundLevel-firebase-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/akauppi/GroundLevel-firebase-web)

<!-- Using 'img' to be able to scale from Markdown.
- Unfortunately, not able to do proper left-alignment (try out what works in GitHub; only that really matters..)
-->
<img alt="Logo" src=".images/icon_512x512.png" width=300 align="left" style="margin: 40px">

<br />

**A modern (ES modules based) Web App template**

- great tools selected for you: [Vue.js 3](https://v3.vuejs.org), [Vite](https://github.com/vitejs/vite), [Rollup](https://rollupjs.org/guide/en/), [Firebase](https://firebase.google.com), [Jest](https://jestjs.io), [Cypress](https://www.cypress.io)
- built on 2020's technology (ES9, async/await), aiming to stay up to date and lean

<br clear=all />

This repo is intended for professionals and beginners, alike. Its main point is to showcase how easy, and effective, making Web Applications in the 2020's is, when (only) modern tools are used.


## Easy for beginners

One learns best by reading other people's code. Actual code. This template is made with that in mind. It's not a partial template, and doesn't create a to-do list.

There's going to be a [narrative](...) that discusses the design in more detail. Some comments for such are left in the `APPROACH.md` files so you can not only read the code but see what choices needed to be made, and why.

For medium and pro level software engineers, you should still get something out of this. The project features e.g.

- social invites
- collaboration
- interactive SVG graphics
- testing
- production builds
- operations / metrics

This hopefully makes the app not only easy, but interesting as well.

But let's cut the chace and get started! 😀



## Firebase

<img src="https://firebase.google.com/downloads/brand-guidelines/SVG/logo-logomark.svg" align="left" style="padding: 1em" />

This repo uses the [Firebase](https://firebase.google.com) serverless framework for a lot of things: authentication, background functions, data storage, operational monitoring.

Firebase allows a mere mortal to create fully functional cloud-based applications. You don't need to set up and maintain servers. You still have a "back end" but it's operated for you. You don't need to care about scalability (though you need to care about costs). Interface definitions become less burdensome than in traditional REST API / GraphQL world, since your front end deals directly with the database. Authentication and access rights management are integrated in the database (instead of a separate back end service you need to build).

>![](.images/backend-vs-firebase.png)

*Figure 1. Traditional cloud vs. Firebase approach <sub>[source](https://docs.google.com/drawings/d/15_rPDZDOCHwdL0RIX8Rg3Der1tb4mx2tMi9asQ_aegw)</sub>*

There are similar offerings from other companies, but they are a year or two behind, in the ease of use, based on the author's opinion.

>Note: You *don't* have to know anything in advance about Firebase. But their educational material is good and fun. It's recommended to check those out in parallel with this repo.

There are links to Firebase resources at the [References](#References).

<!-- tbd. check whether the link works in GitHub -->


<!-- Edit: too much talk. Place this somewhere else
## Where are you now?

><font color=red>tbd. a map here, showing the `app`, `background`, `deploy` and their relationsships to cloud presence (auth, hosting, database, ops)
</font>

The repo grew. Though simplicity is the aim, there are things that simply need to be there. Anything extra should be considered for abandoning, since it makes learning more difficult.

The aim is that a single person (you) can be in charge of all this (and more since you'll likely want your app on top of it).

>Note: Let the author know if there's something unnecessary in the repos.
-->

## Requirements

- `npm`
- `firebase` CLI (Command Line Interface)

  ```
  $ npm install -g firebase-tools
  ```

<!-- Editor's note:
-- unnecessary to mention about the version. Also, better that we check it in software. ;)
You should use `firebase-tools` >= 8.11.1.
-->

>💡 From time to time, run the `npm install -g firebase-tools` command again, to update the tools. Especially worth it if you run into problems.

<!--
Developed with:
- npm (7.5.3) 
- macOS
- node (15.8.0)
-->

The repo is developed on macOS, with latest `npm` and `node`.

>Note: Eventually, we'll test it also on Linux and Windows (maybe restricting to Linux Subsystem for Windows that has Bash). We're not there yet - issues or PRs are welcome! 


## Getting started

>![](.images/y-sign.png)
>
>There's a choice you can do now. Are you more interested in:
>
>- A: seeing your app work in the cloud
>- B: UI development
>
>For route A, sign up to Firebase "blaze" plan and [create a project](README.firebase.md). Then proceed with these instructions.
>
>For route B, change to `packages/app` folder and see the `README` therein. You will be able to play around with the UI <u>without the need to create a Firebase account</u> right now.

<a name="back"></a>   <!-- comes back here from Blaze setup -->
<!-- Editor's note:
- Having self-terminating tag messed up markdown editor.
-->

---

### Fetch dependencies

```
$ npm install
```

This prepares the UI (under `packages/app` folder) and the backend (under `packages/backend`). 

We'll come to these later. For now, the aim is to get the application deployed, under your Firebase account. Then we'll look into development and making changes.

### Tie to your Firebase project
   
```
$ firebase use --add
```
   
The alias you choose doesn't really matter. `"abc"` is okay.

This creates the file `.firebaserc`. You can now use the project from `firebase` command.

```
$ firebase use
Active Project: prod-zurich (groundlevel-160221)
...
```

### No tests?

The `app` and `backend` sub-packages have tests. By the time code reaches us, it's expected to pass the tests.

- The application package is responsible for front-end development and testing.
- We are responsible for front-end *deployment* and *operational monitoring* (of both the app and back-end).
- The back-end package is responsible for back-end development, testing, *and deployment*.

Responsibilities:

<table>
  <thead>
    <tr>
      <th></th>
      <th>development</th>
      <th>testing</th>
      <th>deployment</th>
      <th>monitoring</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>app</td>
      <td colspan=2><pre>packages/app</pre></td>
      <td colspan=2>us</td>
    </tr>
    <tr>
      <td>back-end</td>
      <td colspan=3><pre>packages/backend</pre></td>
      <td>us</td>
    </tr>
  </tbody>
</table>

<!-- Editor's note
Using 'table' to be able to merge cells. Seems 'rowspan' is "on GitHub markdown whitelist"
-->

Because the back-end sub-project takes care of its own deployment, we need to visit there in order to get things up in the cloud.

## Deployment of back-end

We'll just do this fast. There are more information in [packages/backend/README.md](packages/backend/README.md).

```
$ pushd packages/backend

$ npm test     
...
```

The tests should all pass, or be ignored. Note that they run with local emulation; cloud is not involved, yet.

```
$ firebase use --add    # provide the same id as above
```

We need to do this `firebase use --add` separately for each directory where `firebase` CLI is used.

<details style="background-color: #eff; cursor: pointer">
<summary>The longer story..</summary>
<div style="margin: 0 1em">
<p>Firebase stores its state in `~/.config/configstore/firebase-tools.json`. The active projects are stored per folder path:

<pre>
"activeProjects": {
  "/Users/asko/Git/cicp-proto": "cicp-proto-240219",
  "/Users/asko/Git/vue-rollup-example-with-firebase-auth": "dev",
  ...
</pre>

This means if you eg. rename a folder, you'll likely need to redo `firebase use --add`.
</div>
</details>

### State your region

```
$ firebase functions:config:set regions.0="europe-west6"
```

>Note: The convention of `regions.0` is picked up from [here](https://firebase-wordpress-docs.readthedocs.io/en/latest/intro/cloud-functions-deployment.html#change-cloud-functions-regions).


### Deploy

```
$ firebase deploy

=== Deploying to 'groundlevel-160221'...

i  deploying firestore, functions
i  firestore: reading indexes from ./firestore.indexes.json...
i  cloud.firestore: checking ./firestore.rules for compilation errors...
✔  cloud.firestore: rules file ./firestore.rules compiled successfully
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
⚠  functions: missing required API cloudbuild.googleapis.com. Enabling now...
⚠  functions: missing required API cloudfunctions.googleapis.com. Enabling now...
✔  functions: required API cloudbuild.googleapis.com is enabled
✔  functions: required API cloudfunctions.googleapis.com is enabled
✔  firestore: deployed indexes in ./firestore.indexes.json successfully
i  firestore: uploading rules ./firestore.rules...
i  functions: preparing ./functions directory for uploading...
i  functions: packaged ./functions (3.44 KB) for uploading
✔  functions: ./functions folder uploaded successfully
✔  firestore: released rules ./firestore.rules to cloud.firestore
i  functions: creating Node.js 14 (Beta) function userInfoShadow(europe-west6)...
...
```

>ERROR: Right after that, the function does not get deployed. tbd. Study & fix!!!!!!

```
$ popd    # back to root
```


## Deployment of front-end





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