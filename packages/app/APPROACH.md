# Approach

*This doc is to collect a bit more about the approaches taken.*

## Avoid Cloud Function Callables

In the earlier times of the repo, Cloud Function Callables were used for a couple of things. However, they have one huge drawback: they are not available offline.

FireStore is (it caches data), so the approach is to use Cloud Functions only in the background and do all cloud-client data exchange via Firestore.

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

>As a side note, the author wonders why browsers don't provide more built-in  support for authentication UI? Something like [Google OneTap for web](https://developers.google.com/identity/one-tap/web/reference/js-reference) on Android. We trust browsers and it would be better to see a native login screen instead of something that can be easily faked in the browser land. If you know the answer, please chime in. 🔔


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


## Role of `vitebox`

The main role of this folder is to hide `index.html` from the main level.

We only need `index.html` in this development level; it doesn't deserve to be in a central position. Vite gives no configuration entry for hiding it.

This gave a good excuse to place anything involving only this level (not production build) to such a folder.

Production build does not need anything from `vitebox`, so when you do `npm run build`, this configuration does not involve it (but runs the build in the main folder).


## Making Vite and DC house buddies

Problem:

- Running `vite` under Docker Compose needs a Linux version of `esbuild`

Solution:

- Have `esbuild` separately installed within the DC *at one level higher up*.

   This way, the Linux installation can have its way in the *parent* folder (Node packages from parents are automatically visible).

   >Note: Also tried providing `:delegated` (write) access to `node_modules/esbuild` but that didn't work.

Line in `docker-compose[.online].yml`:

```
- ./tmp.dc/node_modules:/proj/packages/node_modules:delegated
```
