# Operations

<font color=red>WARNING: The implementation and documentation of operational instrumentation is still work-in-progress. Expect the number of integrations to increase.</font> 

---


Once you (or your CI) deploy versions to the cloud, that's more the *beginning* of a story than the *end*.

It's *only now* that your users come to the picture. Do they find your application? Do they know how to use it? Can they provide feedback? What if the application crashes! on them?

This is the domain of "devops" or "SREs" (Service Reliability Engineers), who's job is to keep things rolling and to close the feedback loop back from the users to the developers.

## Great tools

Don't worry. Having Firebase in the project already *removes* a large part of things that could go wrong in production, or need nurturing. With some additional tools, we aim to cover the rest.

This is the *purpose* of the "web" repo. To bring in tools that are not application "features" but operation instrumentation.

There are *lots* of such tools. We propose some (works for a single-person project or a startup), while allowing others to be injected with relative ease. In particular, the set of operational instrumentation is *detached from app code* by purpose. This means e.g. that you can:

- integrate with the ops tools your company/employer already uses
- evaluate e.g. two logging services side-by-side; with the same app, until you are decided
- more easily jump wagons (for pricing or whatever reasons)

This *complexity* is quite enough to warrant for a separate ops repo. Hope you appreciate the approach. Let's dig in!

|category|integrations|
|---|---|
|Central logging||
|Crash reporting||
|Performance monitoring|Firebase|


## Central logging

Every now and then you'd likely wish to log to a central location, instead of or in addition to the browser's traditional `console`.

Use `central.debug|info|warn|error` for this.

These functions are expected to work also over connection gaps (offline), collecting logs until there's a chance to ship them (Firestore works the same so why not).

Available integrations:

```
#nada
```

During development, such logs are printed on the console that launched your server. This itself can be helpful in e.g. debugging authentication flows (that include page loads and therefore `console` gets cleared there).

<!-- tbd. DOES? console get cleared in debugging auth flows?? Confirm.
-->

>Note: Firebase does *not* provide central logging. Suggestions on useful integrations are welcome, e.g. Google [Cloud Logging](https://cloud.google.com/logging)?



## Crash reporting

The ops wrapping catches any `Error` that the application would throw (and leak through).

It's shown in the UI and reported to engaged systems:

><font color=red>tbd. a screenshot - currently Error catching does not work</font>

Available integrations:

```
#nada
```


## Performance monitoring

Available integrations:

```
firebase
```


## Ops config

The set you wish to engage are defined in `ops-config.js`:

```
const firebase = {
  type: 'firebase'
};

const ops = {
  perf: [firebase],
  logs: [],   // [airbrake],   // DISABLED: Airbrake not up to it
  crash: []   // [airbrake]    // DISABLED
};

export { ops }
```

Application specific values are defined in `.env.js`:

```
# currently no example
```

<!-- tbd. update once we have some sample -->

These values are like Firebase app configuration: they are not really secrets since anyone with access to the client will be able to pick them up.

>! So, what if someone starts bombarding my back-end with fake crash reports or logs?
>
>There's little you can do against that. You can revoke the misused credentials and do a new deployment with new ones, but the person could pick also those up. You could think of passing such access via Cloud Functions - this would keep the access values hidden (in your back end) and make all access identifiable to the end user, thus being able to ban them. But.. going via Cloud Functions would mean you need to give up on offline monitoring (which some clients would likely allow, eg. collecting logs also when the Internet is not reachable). Maybe have your own caching, then pass them to Cloud Functions of Pub/Sub (if Pub/Sub can be access controlled by Firebase auth)... This does get complicated, but is not impossible.

---

Next: [Design approaches](./README.4-design.md)
