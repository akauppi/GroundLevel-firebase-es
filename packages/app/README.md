# App

Web application sample project.

## Requirements

- `npm`
- `docker`

>Note: We might opt for a wholly Docker-based development experience in the future, no longer requiring `npm` to be installed on your system.

### Cypress setup (for test based development; optional)

Cypress is primarily a desktop application. Please follow these steps to install it:

<details><summary><b>macOS</b></summary>

Visit [Direct download](https://docs.cypress.io/guides/getting-started/installing-cypress#Direct-download) and download the latest version.

- unzip the `cypress.zip`
- move `Cypress.app` to a destination of your liking <small>The author prefers user specific `Applications` folder.</small>
- launch `Cypress.app`
- add the `packages/app` folder as a Cypress project. It will from now on remember this path.

For easy relaunch, move the Dock icon to a suitable position and right click > `Options` > `Keep in Dock`. 
</details>

<details><summary><b>Linux</b></summary>

As per the Cypress [installation instructions](https://docs.cypress.io/guides/getting-started/installing-cypress#Linux-Prerequisites):

```
$ sudo apt-get update
$ sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

Seems there is no desktop download for Linux. You'll need `npm` installed.

Then:

```
$ npm install -g cypress
$ npx cypress open
```
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

- macOS 12.5
- node 18.8
- npm 8.18
- Docker Desktop 4.12.0 with: 3 CPU cores, 2 GB RAM
  - experimental > Enable VirtioFS
-->

## Getting started

```
$ npm install
```

>Note: This will take *ages* on the first time, since it's loading not only the `npm` dependencies but a ~500MB Cypress binary, as well.
>
>If you don't need Cypress (yet), `CYPRESS_INSTALL_BINARY=0 npm install` speeds up the install by skipping downloading the binary part.

### Launch the app

```
$ npm run dev
...

  VITE v3.1.0  ready in 1341 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://172.20.0.2:3000/

...
```

This serves the UI locally, against an emulated Firebase back-end.

Try it: 

[`http://localhost:3000?user=dev`](http://localhost:3000?user=dev)

>Within local mode, you sign in by `?user=dev` query parameter.

Make some changes in the `src/**` files and see that they are reflected in the browser.

<!-- tbd. some more fun mod, perhaps?
>![](.images/modded-welcome.png)
-->

>Note: The IP (`172.20.0.2`) mentioned above exists only within the Docker container. Ignore it.

<!--
tbd. Use color-preserving piping (with `socat`) within the DC, taking the `Network` line out.
-->

## Two development workflows

The above command started a local, emulated version of Firebase. You can also start it with `npm run dev:local`.

The other way is `npm run dev:online`. This works against your cloud Firebase project. We'll come to it shortly.

Differences of these modes:

||Back-end|Data|Users|Authentication|Central logging|
|---|---|---|---|---|---|
|`local`|emulated|primed from `local/docs.js`, at each launch|primed from `local/users.js`|with `&user=<id>`|Realtime Database being emulated|
|`online`|in the cloud|in the cloud; changes are persistent|←|against real accounts|Realtime Database in the cloud|

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

The mode needs `firebase.staging.js` in the project's root, to find the staging project. This should have been created during your first deployment (see root `README.md`).

>Note: You can choose another project by `ENV=abc npm run dev:online`.

#### Launch! 🚀

Launch the server:

```
$ npm run dev:online
...
```

Point your browser to `http://localhost:3001`.

Changes to your front-end files are still reflected in the browser, but back-end services are now run in the cloud. Changes you do to the data will persist. So will your logs. Traffic you create will be using your [quotas](https://firebase.google.com/docs/functions/quotas).

The two development modes are completely orthogonal - you can run them side by side, in different terminals. By default, local uses port 3000 and online port 3001.


## Linting

Before we look at tests, a brief mention on linting.

```
$ npm run lint
...
```

This gives you warnings that you may or may not wish to fix. Steer them at `.eslintrc.cjs`.

>Note: At the moment (<strike>Apr 2021</strike> Jul 2022) we're not focused on reducing the number of lint warnings.

With the sample app, there may be warnings but there should not be errors.

## Testing

You can use Cypress for test based development as well as running all the tests, from command line.

- Make sure you have followed the instructions in the "Requirements" section, concerning Cypress desktop application.


### Running all the tests

```
$ npm test
```

This runs all the front-end tests and returns you back to the OS prompt.

>Note: `npm test` launches a DC environment in the background. This reduces the startup time, in case you were to run `npm test` multiple times.


### Test based development

The other way is to keep `npm run dev` running, and edit both one's code and tests (and Security Rules) while keeping an eye on the test results.

Have `npm run dev` running in a terminal.

Visit `http://localhost:3000` with a browser, at least once. The first load warms up Vite.

<!-- tbd.
Could do a `curl` within DC, to warm up automatically.
-->

Launch Cypress and pick the `packages/app` subfolder.

><sub>There are two ways to launch Cypress, either from its Desktop icon (recommended) or by `npx cypress open --e2e` in the `packages/app` folder.</sub>

- Choose `E2E testing`

  - Choose any browser (depends on what you have installed on your computer).

![](.images/cypress-launch.png)

Try to run the tests.

![](.images/cypress-run.png)

As you can see in the image, always keep the developer tools open while running Cypress tests. It helps.

>Note: It seems, with Cypress 10 there is no longer a "Run all tests" option in the dashboard. That's a shame (so you'll end up `npm test`ing for seeing what fails, and drilling into it here).

Now edit some test in the IDE (they are under `cypress/e2e`).

Cypress will automatically re-run tests while you make changes to the source - or the tests. A big display becomes useful, here!

In short, you can:

- *time travel* to see what the UI looked, at the time the tests were executed. (hover over the test steps)
  - *pin* your view to a particular step in time, by clicking on it
- Use the *regular browser tools* to inspect components, see the console etc. also within a time-travelled render!

<font size="+3">*The Cypress approach changes the way we do software. The more time you spend with it, the more time it likely will save you.*</font>


>**Note:**
>Some Cypress features like "stubs" and "proxies" are not need, at all. Those are intended for building scaffolding when running things locally, but we have the whole Firebase emulators so we can work against the Real Thing.


## Manual testing on other devices

Both `npm run dev` and `npm run dev:online` expose their ports to all network interfaces, within your computer.

This means, the web app is browsable also from a phone, tablet etc. in the same network. All you need is to find out the outwards-facing IP number of your computer (let's say it's `192.168.1.62`), and open `http://192.168.1.62:3000` (or 3001) from your other device.

<!-- hidden

>Note: There's a LOT more to developing with another device. You can tie both the Safari and Chrome browsers with a desktop browser, seeing the debugging information within the desktop.
>
>This is beyond the purpose of a `README`, though.
-->

### Finding your IP number

|OS|Steps|
|---|---|
|macOS|`Preferences` > `Network` > (adapter) > `IP address`|
|macOS (terminal)|`ifconfig`|
|Windows 10 + WSL2|...tbd.|

<!-- tbd. #contribute
|Windows 11|...|
|Linux|`ipconfig` ??|
-->

<!-- tbd.
Make a nice helper (`make show-ip`) to cover the OS differences.
-->

## Production build

```
$ npm run build
...
vite v3.0.0-beta.9 building for production...
✓ 197 modules transformed.
../dist/index.html                         1.51 KiB
../dist/aside-keys.42ab51fe.js             14.01 KiB / gzip: 5.86 KiB
../dist/aside-keys.42ab51fe.js.map         44.04 KiB
...
../dist/firebase-firestore.1ecd9c81.js     464.63 KiB / gzip: 111.93 KiB
../dist/firebase-firestore.1ecd9c81.js.map 1140.85 KiB
```

This builds your front end application in `dist/` folder.

>Hint. We also use [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) to provide a browsable report of the modules. Check it out by opening `stats.html`.


<!-- Hidden; didn't get the DC solution to work.  Needs `npm install -g http-server`
### Serve the `dist` (optional)

Just to peek that the build results are useful, you can run:

```
$ npm run serve
```

>Note: `serve` simply serves what's in the `dist/` folder. It does not rebuild the application.
-->


## Next steps...

You can now start developing your own application - both backend and front-end.

When you feel like it, take a look at the following folders that have information about managing the application's full lifecycle:

- [`/ci`](../../ci/README.md) - Continuous Integration, using [Cloud Build](https://cloud.google.com/build)

   You set up the cloud to track changes to your version control, so that code changes get automatically tested and deployed.
   
- [`/ops`](../../ops/README.md) - Operational monitoring, using [Sentry](https://sentry.io/for/javascript/)

   Learn about how to see whether your users are there, and how their experience using the app is.


This concludes the web app feedback loop. Make great apps, gain users and have a great time!!!
