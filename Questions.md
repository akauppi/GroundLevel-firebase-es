# Qs

## What about IE11 support?

It doesn't support ES6 modules. If you need IE11 support, it's fairly easily doable.

- Check out [@rollup/plugin-buble](https://github.com/rollup/plugins/tree/master/packages/buble) and take it to use
- Change the Rollup output format from `esm` to e.g. `iife`

You may need to experiment. Once done - and if you wish to maintain the work - it could be incorperated as an `ie11` branch.

The reason this is not default is just avoiding any complexity. The template aims to be slender and smooth.


## Firestore

### Is it better to name document keys `last-used` or `lastUsed`?

Which is more customary, in Firestore?


### Can I tell Firebase Performance the version of my app?

I know a `version` string. Would like to use it as a filter in Performance metrics, like country, browser are being used.

[Here](https://firebase.google.com/docs/perf-mon/custom_traces-metrics?platform=web#attributes-and-metrics) is mentioned:

>applicable metadata like app version (that is collected)

Where does Firebase get that version?

Seems like the "version" applies to iOS and Android: 


**Suggestion:**

Allow providing a web application's version as:

```
const perf = firebase.performance("0.0.1-abc");
```

or in:

```
firebase.initializeApp({
  ...
  version: "0.0.1-abc"
});
```

### What does Firebase offer for centralized web app client logging?

I want to be able to statistically see, how many of my users are getting to a certain code paths, in their client (e.g. warnings, errors). Want such logging to be "offline" friendly, i.e. cached.

A big point in this becomes also the possibilty to filter and analyze the logs, later.

There doesn't seem to be a solution to this, within Firebase. What do you use? Am I looking at this wrongly? 

"Firebase logs" are for server-side functions only.

Alternatives:

- write to Cloud Firestore debugging collection
- Datadog etc.



## Does Vue.js 3 have a corresponding thing to `renderError`?

Vue.js 2 had this this - what's a similar way with Vue 3 (beta)? Do we need this?

```
  renderError: (h, err) => {  // pour runtime problems on the screen, if we have them (may help in development);
                              // in production we may want to pour these to central monitoring
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
```

## Vue.js 3: is the renderer optimized for changing object but fields remaining the same?

`project` is a `ref({})`. 

When we get database updates, normally only one of the fields changes, but we replace them all:

```
project.value = {...d};
```

This means, Vue.js gets a new object, with most fields the same as in the one it carried before.

Should it be done in a different way?


## JavaScript / Vue.js 3: is there a way to know when a `ref` is no longer listened to?

- [ ] Make a case of this on StackOverflow, one day?

If there is, we can take away the explicit `.unsub()`.


## Vue.js 3: do I need `:key` when iterating an object?

```
<li v-for="(m,uid) in members" :key="uid">
```

Can the `:key` just be left out (but the key still picked):

```
<li v-for="m in members">
```


## Airbrake: how to provide version/build info?

..for a web app

Ideally, we'd like to provide them as `new Notifier({ ... })` params.

