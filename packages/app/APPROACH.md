# Approach

*This doc is to collect a bit more about the approaches taken.*

## Avoid Cloud Function Callables

In the earlier times of the repo, Cloud Function Callables were used for a couple of things. However, they have one huge drawback: they are not available offline.

Firestore is (it caches data), so the approach is to use Cloud Functions only in the background and do all cloud-client data exchange via Firestore.

When, later, we need to do some more real time dataflow, it's either Firebase Realtime Database or a message bus like PubSub. In such a case, we might need to prepare offline awareness ourselves, into the app. `#speculative`

## No data store

Data is stored distributed, in the `Ref`s around the code. There did not seem to be a need for a centralized data store, à la Vuex.

## Authentication UI

We don't use [Firebase UI](https://github.com/firebase/firebaseui-web) (used by maybe 99% of Firebase web projects) but a web component made specifically to replace it.

The reasons are many:

- Firebase UI didn't catch up with ES modules in time
- At 195 kB, Firebase UI is bulky
- It is very badly maintained; not part of the official Firebase web offering (yet crucial)
- It is *waaaaay* overcomplex. The author was not able to compile it from sources, to begin with (!)

In short, the author gave up hope on it ever catching up with modern times.

If features are lacking in the web component, let's build them in there.

>As a side note, the author wonders why browsers don't provide more built-in support for authentication UI? Something like [Google OneTap for web](https://developers.google.com/identity/one-tap/web/reference/js-reference) on Android. We trust browsers and it would be better to see a native login screen instead of something that can be easily faked in the browser land. If you know the answer, please chime in. 🔔

<p />

>Note: [WebAuthn](https://webauthn.guide) please?


## Component naming convention

Vue.js normally uses `like-this` naming for its components.

We reserve that for externally imported web components, and have our own Vue components `LikeThis`.

Externally imported *Vue* components must be white listed.


## Cypress: Sharing the `dev:local` server

Running Cypress tests requires `npm run dev` to be running (or launches it, in the case of `npm test` if it's not running). It uses the same server as our "local" development mode.

However, tests have *different users*, and therefore different data. The local development (`local/**`) and the tests (`cypress/**`) are detached from each other.

||`dev:local`|Cypress|
|---|---|---|
|users|`dev`|`joe`, `william`, ...|
|data|`local/`|`cypress/`|

Why do it so?

Because there doesn't seem to be much harm, and this seems least overall complexity.

One can now keep `npm run dev` running, use the local development mode (browser and IDE), or hop over to Cypress if one feels like.


<!-- tbd. replace:
--
## Installing Cypress as a dependency

Because:

- It is a versioned tool: this way we can hopefully steer clear of version incompatibilities
- Cypress [recommends](https://docs.cypress.io/guides/getting-started/installing-cypress.html) doing so.

Cypress does cache the binary parts, across `npm` projects, so the disk space use (about 637MB for Cypress 7.1.0 on macOS) is similar to installing it on the desktop.
-->

## Cypress & Windows 10: *both* as a desktop installation and via `npm`

Yeah. 🤪💪

The `npm`-installed version is for `npm test`.

The Windows version is for test based development.

This in completely in line with the mental model that editing one's files is in Windows, while builds (and command line things like `npm test`) happen in WSL2.

Unfortunately (because Cypress doesn't have Windows 10 + WSL2 support where it could eg. provide a browser UI to the Cypress running within WSL2 `#wink^2` 😉), we force the developer to install *two* separate Cypresses.

Cons:

- double the disk use
- different versions
- no upgrade path for the Windows version[^1-cypress-update]

Pros:

- no need for X Server setup!

[^1-cypress-update]: To manage the version of the Cypress on Windows, one could set up a dummy Node package there (instead of WSL2), and use `npx cypress open` to pull the binary app.


## Cypress: Naming of the folders

Comparision to Cypress folder naming conventions:

||us|Cypress defaults|
|---|---|---|
|commands|`cypress/commands`|`cypress/support`|
|tests|`cypress/**.spec.js`|`cypress/integration/*.js`|

This was a *hard call*. Often, it's best to follow established conventions for familiarity if one uses the tool elsewhere. However, in our case:

- There's no point in calling tests "integration". They are just tests.
- What does "support" really mean? Those files initialise the Cypress *commands* (`cy.something`).

The ability to have multiple test folders within `cypress` is intentional. This helps separate different *testing stories* from each other - and these can be many. Initially we have:

- `anonymous`: testing what a guest sees and anonymous login
- `joe`: testing the UI from Joe D.'s point of view


## DC `run` vs. `up`

The `docker compose up` command drives a singleton. There's either one such service, or none.

This is fine for eg. `npm test` where we can keep a service ready in the background.

Using `docker compose run -e ...`, or overlaying Docker Compose files, allows *multiple* variants of the same theme to run, simultaneously. We use this for `npm run dev:{local|online}`.

For `npm run build`, the choice is simple (we use `run`), since it's a task, not a service.


## Running Vite as a Docker tool

There is a movement (in 2022) for "JavaScript containers". 

We're carefully testing these waters, and eg. have baked a Docker container for Vite. We treat it *as any other (command line level) tool*.
 
Pros:

- Tool is pushed aside a bit more (more simple, maybe?)

Cons:

- Harder to notice version changes (might also be a good thing to update build tools less frequently than libraries..?)


## Baking in the Firebase access values

Normally, Firebase hosting provides the access values at `/__/firebase/init.js[on]`.

This is true also for our project, but it takes one extra network round trip to fetch those, and we prefer to avoid it. This makes the web app start snappier.

Instead:

- you set up a staging project (creates `../../firebase.{staging}.js`)
- build scripts read the access values from there, and inject them into the build

This also means that the front end can be hosted on *any* service provider, not just Firebase Hosting.


## Docker Compose: to `extend` or not?

At one point, this repo uses multiple `-f` flags (in `package.json`) to tailor Docker Compose definitions from a base and the dev/online/test/prod differences. This works, but is clumsy.

For one, one cannot rename a service (from the one it builds upon), so they cannot have descriptive names.

It turns out, `extends` is a thing in Docker Compose (non-versioned, DD 4.8.2).

However, it's not really documented and there's a [long thread](https://github.com/moby/moby/issues/31101) (2017-) about the need, or not, of `extend`.

Can we trust weight on it?

1. Let's try!
2. If "they" (DC authors) take it away, let's move to templating outside of DC.

   Can for example have a Node.js script producing the right YAML, from parameters.

<!--
<font size=8>🤨</font>
-->

