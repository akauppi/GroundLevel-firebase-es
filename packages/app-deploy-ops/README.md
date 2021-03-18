# app-deploy-ops

Takes the app developed in `../app` sister package and prepares it for operations.

Adds:

- `@ops/central` implementation that connects the app's logging calls to a cloud service
- `@ops/perf` performance monitoring
- crash reporting

- Firebase production initialization

We get the application logic as a module dependency, and don't expect anything from it (apart from it needing Firebase initialized and implementations for `@ops` modules). It can use any web framework, for example.

Available integrations:

|||
|---|---|
|Logging|tbd.|
|Performance monitoring|tbd.|
|Crash reporting|tbd.|

>🌺 Note: You can tie any ops to more than one back-end at the same time. This may be useful if evaluating vendors or transitioning between them.


## Requirements

- npm
- `firebase-tools`

### Firebase

There is an active project; you've run `firebase use --add`.

<!-- disabled
## Rollup vs. Vite

We'd like to be able to build with two options: plain Rollup and Vite (that uses Rollup underneath).

Unfortunately the Vite build is currently [not working](https://github.com/akauppi/GroundLevel-firebase-es/issues/35) ...snipped...

>Edit: We got to Vite vs. Rollup size comparisons. Vite 488kB vs. Rollup 496kB (these likely are from different code bases, but there is no big sway one way or the other).
>
>One day, let's decide to have them both up - or toss one permanently aside?
-->

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
created roll/out in 8.1s
```

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

>Note: The UI uses a backend deployed to the cloud.
>
>If you haven't deployed the back end, yet, head to `../backend` sister package and follow its instructions.


### Watch mode

If you develop the integration part (code in `src/`), it may be useful to have the code automatically repackaged after changes.

```
$ npm run watch:roll
```

>Note: This might not have Hot Module Reload (as `app` development has). Just press Refresh on the browser.

<!-- hint: contributions on setting up HMR for Rollup are welcome :)
-->

### Stats

It's good to keep an eye on the packaging sizes.

There are many Rollup packages for this, and the choices done in this repo may not be the best.

We have:

- `rollup-plugin-analyzer` showing the output sizes on every build; this is nice
- `rollup-plugin-visualizer` creates `roll/stats.html` (that you can open in Chrome) showing the same info in a graphical manner

>Warning: Don't open `roll/stats.html` with Safari.

>💡: Please suggest your favourite plugins to the author; we can also think of stripping these completely away - it's a very personal thing and maybe best left for tools that visualize a directory already created (not needing to be part of the build setup).


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


<!-- tbd. maybe this motivation to the root README? -->
## Op[eration]s

Deploying an app is like only starting a race.

You want people to find your app, and you want it to remain in good health for them. This is the "ops" (operations) side of things.

The whole layout of this repo is based on enabling different people (or teams) to work on the app and on the ops. These are often conflicting disciplines but it's also very beneficial to take turns in both worlds, whether you are a sole developer or member of a team. The best results are gained by developers who understand operations - and operations people who understand the underlying code.

The [SRE (Site Reliability Engineering)](https://en.wikipedia.org/wiki/Site_reliability_engineering) movement states this wonderfully in one of their books. Developers aim for feature delivery; ops aims for reliability. This is a philosophical realm, too deep to cover here, and well structured in the work you can [read online](https://sre.google/books/).

---

<p align=right>Next: <a href="./README.2-logging.md">Logging</a></p>
