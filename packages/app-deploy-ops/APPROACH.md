# Approach

## Baking in the Firebase access values - why?

Normally, Firebase hosting provides the access values at `/__/firebase/init.js[on]`.

This is true also for our project, but it takes one extra network round trip to fetch those, and we prefer to avoid it. Instead:

- you log into the Firebase project
- build scripts read the Firebase access values (via `npx firebase apps:sdkconfig`), and inject them into the build

Everyone's happy? 😊

### Reasoning

In the design of this repo, we have tried to avoid the need to "log in" to Firebase account (or to use the Firebase CLI at all, for that matter).

Here is the exception. Even now:

- you should use a staging account, not a production one. Leave that to CI/CD.
- you only need to do this occasionally, if wanting to eg. test the application wrapping

Most of your work is done in the `app` subpackage, and you don't need to be logged in.


## Pulling in App via npm

This is pretty awesome!

We treat the application build as a dependency (which it is), and curry on top our own ops code.

In a nutshell, this approach puts the **production build** responsibility on the "app" sub-package whereas the **ops instrumentation** responsibility remains with us. 👏

**Alternative**

Importing as ES sources. This would mean that we *at least* need to be aware of the web framework used in building the app, and provide right build plugins for it. Since the App side already does this, it would be a duplicated effort.


<!-- disabled
## Using Rollup vs. Vite

Vite is mainly a rapid development tool (HMR = Hot Module Reload). Why would we use it for just building the final stage?

Pre-fetches for one. When our `index.html` has this:

```
<script type="module">
  import '/src/main.js';
</script>
```

..Vite expands it to this (`public/index.html`):

```
  <script type="module" crossorigin src="/assets/index.65ee72bf.js"></script>
  <link rel="modulepreload" href="/assets/vite.d0d1ba23.js">
  <link rel="modulepreload" href="/assets/index.esm.bafcf996.js">
  <link rel="modulepreload" href="/assets/tslib.d012e74f.js">
  <link rel="modulepreload" href="/assets/firebase-misc.13a81d66.js">
  <link rel="modulepreload" href="/assets/tslib.es6.6591dcdb.js">
  <link rel="modulepreload" href="/assets/firebase-auth.1d914af5.js">
  <link rel="modulepreload" href="/assets/firebase-firestore.b74557a0.js">
  <link rel="modulepreload" href="/assets/firebase-functions.cd464059.js">
```

We can do the same in Rollup, but need to manually create the actual `index.html` from a template.

By using Rollup, we need to code something like the above ourselves (which isn't too much) but we get a leaner toolchain with less fluff.

Ideally, we do both, allowing us to compare the output sizes and ease of development.

>Edit: Did the Rollup side. Now Vite doesn't fully work.
-->

## Where to log?

This should be simple, but...

Firebase doesn't have a clear solution for central logging of web applications. 

### Log Events

There is [Log Events](https://firebase.google.com/docs/analytics/events) (part of Analytics) that states:

> Events provide insight on what is happening in your app, such as user actions, system events, or errors.

That's great! Pretty much what I want. Except...

To use "Log Events" one needs to enable Google Analytics for the Firebase project. The author would rather not have that, as such a central (*pun*) step as logging is.

>Sideline: You can of course use Log Events if that suits your application! Just bake it into your app in the `app` subpackage.

### Cloud Logging

The two most important aspects in selecting a logging system (according to the author) neither have to do with the applications being logged.

1. Familiarity. Does your team/company already use a logging system? It makes sense to keep all logs available with the same UI, commands and integrations.
2. Ease and speed of UI (with *large* amounts of logs). If you have a great logging system, but it's sluggish, it's no good. We need logs most urgently in times of <strike>panic</strike> high anxiety, and them behaving swiftly and being easy to steer are what saves the day! 🌞

The GroundLevel logging system is designed for adapters, allowing one to support the selected logging provider, rather easily.

<!-- Not implemented. Open up, once functional.

As an initial adapter, we support [Cloud Logging](https://cloud.google.com/logging/docs). This is where your Cloud Functions logs are going, anyhow. The product also passes the "ease and speed" test above, in the author's opinion.

For some reason, there is no direct web app -> Cloud Logging possibility (without possibly complex authentication dances?). This is why the Cloud Logging adapter batches and ships the logs to your Cloud Functions, which then pass them on to Cloud Logging - which makes them visible for you in the dashboard.

This is not ideal. It means we need to cater for offline mode, transmission failures and optimize for batch size. But heck, it seems it's the way to go. 
-->

**References:**

- [Collecting browser console logs in Stackdriver](https://medium.com/google-cloud/collecting-browser-console-logs-in-stackdriver-fa388a90d32b) (blog, Dec 2019)

   *Stackdriver was the earlier name for Cloud Logging*


