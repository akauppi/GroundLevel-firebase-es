# Approach

## Pulling in App via npm

This is pretty awesome!

We treat the application build as a dependency (which it is), and curry on top our own ops code.

In a nutshell, this approach puts the **production build** responsibility on the "app" sub-package whereas the **ops instrumentation** responsibility remains with us. 👏

**Alternative**

Importing as ES sources. This would mean that we *at least* need to be aware of the web framework used in building the app, and provide right build plugins for it. Since the App side already does this, it would be a duplicated effort.


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


## Where to log?

This should be simple, but...

- Google Cloud Logging (that eg. Cloud Functions automatically uses) doesn't have a browser client
- Firebase [Log Events](https://firebase.google.com/docs/analytics/events) (part of Analytics) says:

  > Events provide insight on what is happening in your app, such as user actions, system events, or errors.
  
  Well, that sounds awefully sweet.
 
What are our criteria?

- being offline friendly, without needing to code it
- able to convey things like application errors, crashes, success (i.e. logging levels)
- having a good UI for filtering the logs (*fast*, too; part of the usability of such tools)

I first thought Cloud Logging, then Log Events, now Cloud Logging again... The big negative of Log Events is that it forces Google Analytics to be switched on for the Firebase project [^1]. Also otherwise, it seems to push terms like "conversion" to the dashboard UI where I'm not really (at the moment, at least) concerned about thouse. I.e. it's *biased* towards a certain kind of use.

And that's fine. But in such a case, developers can use it *within their apps* as a dependency, and the *ops* side of GroundLevel can do without `@firebase/analytics`. Hip, hip, ....? 🥳

[^1]: Nothing against that, just wouldn't like to make it so central -- *pun intended*.



