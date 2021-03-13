# app-deploy-ops

Takes the app developed in `../app` sister package and prepares it for operations.

Adds:

- ops instrumentation code (central logging, crash reporting, performance monitoring, etc.)
- Firebase initialization

We get the application logic as a module dependency, and don't expect anything from it (apart from it needing Firebase initialized). It can use any web framework, any libraries.


## Requirements

- npm
- `firebase-tools`

### Firebase

There is an active project; you've run `firebase use --add`.


## Getting started

Install dependencies:

```
$ npm install
```

Prepare and build `../app`:

```
$ (cd ../app && npm install && npm run build)
```

Build for deployment:

```
$ npm run build
...
created roll/out in 9.8s
```

>Note: We'd like to get a summary of the chunks produced; something like Vite does.

After the command you have a ready-to-be-deployed web app under `roll/out`.


### Try it out

```
$ npm run serve
...
i  hosting: Serving hosting files from: roll/out
✔  hosting: Local server: http://0.0.0.0:3012
...
```

Visit [http://localhost:3012](http://localhost:3012) and you should see a UI.

><font color=red>WARNING: Currently BROKEN!!!</font>

>Note: The UI uses a backend deployed to the cloud.
>
>If you haven't deployed the back end, yet, head to `../backend` sister package and follow its instructions.

## Deploying

*This will eventually be made to use CI/CD for deployments: whenever there is a working set pushed to `master`, your cloud setup (eg. GitHub) takes care of deploying it to the larger audience. Such a setup is intended to be part of this repo. Until then...*


```
$ npm run deploy
...

=== Deploying to 'groundlevel-160221'...

i  deploying hosting
i  hosting[groundlevel-160221]: beginning deploy...
i  hosting[groundlevel-160221]: found 14 files in vite/out
✔  hosting[groundlevel-160221]: file upload complete
i  hosting[groundlevel-160221]: finalizing version...
✔  hosting[groundlevel-160221]: version finalized
i  hosting[groundlevel-160221]: releasing new version...
✔  hosting[groundlevel-160221]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/groundlevel-160221/overview
Hosting URL: https://groundlevel-160221.web.app
```

You can now try the web app at the URL shown on the console:

[https://&lt;<i>your project id</i>&gt;.web.app](https://YOUR-PROJECT-ID.web.app)

---

<p align=right>Next: <a href="./README.ops.md">Ops monitoring</a></p>
