# App

Web application sample project.

## Requirements

- `npm`
- Docker Compose 2.x

### Cypress setup

Cypress is brought in via `npm`, but in order to use it as a desktop application (which it is), please take the following steps:

<details><summary><b>macOS</b></summary>

After `npm install`:

```
$ npx cypress open
```

This opens Cypress for the first time. 

Move the icon to your favourite location and right click > `Options` > `Keep in Dock`.

This helps you launch the tool as a desktop application, in the future.
</details>

<details><summary><b>Linux</b></summary>

As per the Cypress [installation instructions](https://docs.cypress.io/guides/getting-started/installing-cypress#Linux):

```
$ sudo apt-get update
$ sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

That's all. You'll be using the Cypress version installed via `npm`. Launch it with `npx cypress open` after the install.
</details>

<details><summary><b>Windows 10 + WSL2</b></summary>

Windows and WSL2 duo is not a supported Cypress platform. This means you will need to do a little bit more than the other OSes. In short, you'll use *one* Cypress via `npm`, within WSL2, for "headless" testing (`npm test`).

For test based development, we recommend installing *another* instance, this time on the Windows side.

- Within WSL2, follow the above instructions for Linux. This prepares the headless Cypress.
- Within Windows, follow the [direct download](https://docs.cypress.io/guides/getting-started/installing-cypress#Direct-download) (desktop install) guide
   - Download `cypress.zip` 
   - Extract it at a temporary location
   - Move the resulting folder into a suitable place (eg. under your user's folder), from where you'll launch the application.

   Note that Cypress does not install as a normal Windows program, and it does not show in the `Start` menu. To uninstall Cypress, just trash the whole folder it's in.

Try launching the `Cypress.exe` app.
</details>

<details><summary><b>Windows 11</b></summary>

Windows 11 brings WSLg, allowing one to [run Linux GUI apps](https://docs.microsoft.com/en-us/windows/wsl/tutorials/gui-apps).

This means you should be able to run the Cypress installed within Linux, and use its GUI from Windows.

*The author does not have access to Windows 11, so any guidance on how this works in practice is appreciated. i.e. a PR :)*
</details>

<!--
Development is done with: 

- macOS 12.3
- node 18.0
- npm 8.6
- Docker Desktop 4.7.x with: 2 CPU cores, 2 GB RAM, 512 MB swap
  - experimental > Enable VirtioFS
-->

## Getting started

```
$ npm install
```

>Note: This will take *ages* on the first time, since it's loading not only the `npm` dependencies but a ~600MB Cypress binary, as well.
>
>If you don't need Cypress (yet), `CYPRESS_INSTALL_BINARY=0 npm install` speeds up the install by skipping downloading the binary part.

Launch the app:

```
$ npm run dev
...

  vite v2.4.4 dev server running at:

  > Local:    http://localhost:3000/
  > Network:  http://192.168.1.62:3000/

  ready in 489ms.
  
...
```

This serves the UI locally, against an emulated Firebase back-end.

>Within local mode, you sign in by `?user=dev` query parameter. Even though the social sign-in button is visible, don't use it.

<!-- tbd. Could dim the social sign-in with a hover tip on `?user=dev` -->

Try it:

[http://localhost:3000?user=dev](http://localhost:3000?user=dev)

Try making some changes in the `src/**` files (eg. change the title in `src/pages/Home/index.vue`) and see that they are reflected in the browser.

<!-- tbd. some more fun mod, perhaps?
>![](.images/modded-welcome.png)
-->

## Two development workflows

The above command started a local, emulated version of Firebase. You can also start it with `npm run dev:local`.

The other way is `npm run dev:online`. This works against your cloud Firebase project. We'll come to it shortly.

Differences of these modes:

||Back-end|Data|Users|Authentication|Central logging|
|---|---|---|---|---|---|
|`local`|emulated|primed from `local/docs.js`, at each launch|primed from `local/users.js`|with `&user=<id>`|browser console|
|`online`|in the cloud|in the cloud; changes are persistent|←|←|command line|

>**Note:** Tests (`npm test`) also use local mode but bring their own data and users. You can keep `npm run dev` running, and use it both for browser development and running Cypress tests. The two use different Firebase project id's so their data and users won't overlap.


### `dev:local`

Use this mode when:

- you are developing back-end features (Firestore security rules, Cloud Functions) and want to test that they work with the front-end.
- you want to start with primed data and users, each time, instead of persisting the changes
- you want to skip the sign-in dialog, to speed up development a few clicks
- you don't have a Firebase account, yet

With local mode, you can test back-end features while developing them, and only deploy working stuff.


### `dev:online`

With "online" development, you run against the Firebase back-end services, but still have hot-module-reload to help in developing the UI.

Use this when:

- the back-end is stable, and you are working on UI features
- the back-end is deployed
- you don't mind actually changing data
- you have a Firebase account
- you want to sign in as a real user

The mode needs `firebase.staging.js` in the project's root, to find the staging project. Instructions for creating it are in the root `README`.

#### Launch! 🚀

Launch the server:
  
```
$ npm run dev:online
...
```

Point your browser to `http://localhost:3001`.

Changes to your front-end files are still reflected in the browser, but back-end services are now run in the cloud. Changes you do to the data will persist. Traffic you create will be using your [quotas](https://firebase.google.com/docs/functions/quotas).

The two development modes are completely orthogonal - you can run them side by side, in different terminals. By default, local uses port 3000 and online port 3001.


### When to use which mode?

Just try, which suits your way. :)

As mentioned above, if you work on UI features only, `dev:online` may be better.

If you work on removing data, `dev:local` may suit best, since it always boots from a known-good data set (and users).

You can customize the `local/*` setup to your development needs. Tests carry their own data and users, so they are safe from your changes.

Before we look at tests, a brief mention on linting.


## Linting

```
$ npm run lint
...
```

This gives you warnings that you may or may not wish to fix. Steer them at `.eslintrc.cjs`.

>Note: At the moment (Apr 2021) we're not focused on reducing the number of lint warnings (or even errors).

With the sample app, there may be warnings but there should not be errors.


## Testing

You can use Cypress for test based development as well as running all the tests, from command line.

- [ ] Make sure you have followed the instructions in the "Requirements" section, concerning Cypress desktop application.


### Running all the tests

```
$ npm test
```

`npm test` launches the same local server as `npm run dev`, and runs Cypress tests on it.


### Test based development

The other way is to keep `npm run dev` running, and edit both one's code and tests (and Security Rules) while keeping an eye on the test results.

Have `npm run dev` running in the background. 

Launch Cypress and pick the `packages/app` subfolder.

![](.images/cypress-launch.png)

Try to run the tests.

![](.images/cypress-run.png)

As you can see in the image, always keep the developer tools open while running Cypress tests. It helps.

Now edit some test in the IDE (they are under `cypress/anonymous` and `cypress/joe`).

>**Disclaimer:** 
>
>After long retaining to the Cypress convention of `cypress/integration`, the author changed the folder structure to reflect the various user stories a front end might have. Thus, within `cypress` folder, tests for a certain user story are in their own folder. Naturally, you may set this back to Cypress defaults if you wish. Also, `cypress/support` was renamed to `commands` since it's where custom commands come from.

Cypress will automatically re-run tests while you make changes to the source - or the tests. A big display becomes useful, here!

In short, you can:

- *time travel* to see what the UI looked, at the time the tests were executed.

The Cypress approach changes the way we do software. The more time you spend with it, the more time it likely will save you.


>**Note:**
>Some Cypress features like "stubs" and "proxies" are not need, at all. Those are intended for building scaffolding when running things locally, but we have the whole Firebase emulators so we can work against the Real Thing.


## Production build

```
$ npm run build
...
vite v2.3.8 building for production...
✓ 55 modules transformed.
dist/aside-keys.js   17.91kb / brotli: 5.64kb
dist/aside-keys.js.map 28.60kb
dist/style.css       5.26kb / brotli: 1.43kb
dist/app.es.js       33.24kb / brotli: 8.14kb
dist/app.es.js.map   65.48kb
dist/vue-router.js   52.54kb / brotli: 11.63kb
dist/vue-router.js.map 172.74kb
dist/vue.js          132.61kb / brotli: 26.22kb
dist/vue.js.map      512.57kb
```

This builds your front end application in `dist/` folder. It contains all the logic and the styles that your application has, but it lacks the operational awareness that makes it fully ready for production.

We'll add that layer in the next sub-package, `app-deploy-ops`.


## Maintenance 

### Cleaning up after Cypress

Cypress binaries are gathered in [a cache directory](https://docs.cypress.io/guides/getting-started/installing-cypress#Binary-cache). You might want to clean the earlier ones away, at times, to save disk space.

### Updating `vite`, Vite config, `@vitejs/plugin-vue`

The Vite server is running in DC, so in order to apply the changes, make sure to run down the earlier instance:

```
$ docker compose -f docker-compose.yml -f docker-compose.online.yml --env-file ./.env.dc down
```

>You can do the same in Docker Desktop's Dashboard: just remove the `app` > `app_vite*` containers.

