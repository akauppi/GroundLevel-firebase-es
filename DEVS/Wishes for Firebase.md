# Wishes for Firebase

Dear Firebase. Parts of you are awesome.

Google is taking good care of trying to face-lift you (Cloud Functions [v2](https://firebase.google.com/docs/functions/beta), for example).

Having said that, you have some wrinkles...

>This file contains feedback on Firebase libraries, APIs and online services. Issues on Firebase CLI (including emulators) are in [another doc](Wishes for Firebase CLI.md).


## Too many issues makes one look weak.. 🙇

The number of open issues is an indicator of a project's popularity, but also of the expected quality. Firebase repos can do a better work, here.

- `firebase-admin-node`: 73 open issues, oldest created Jun 2017 (5 years) [link](https://github.com/firebase/firebase-admin-node/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc)
- `firebase-tools`: 329 open issues, oldest created May 2016 (6 years 3 months) [link](https://github.com/firebase/firebase-tools/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc)
- `firebase-js-sdk`: 383 open issues, oldest created May 2017 (5 years 3 months) [link](https://github.com/firebase/firebase-js-sdk/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc)
- `firebase-functions`: 30 open issues, oldest created May 2019 (3 years 3 months) [link](https://github.com/firebase/firebase-functions/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc)

Before attending any of the requests below, it would be important that:

- these issue lists (and related PR lists!!!) get full, **weekly** attention by someone
   - ..grooming them, removing duplicates and
   - making sure **new issues** are swiftly taken care of

This must be a systematic effort. Make dashboards that show trends (we can do this as a community effort - the data is public) and motivate to counteract the rising tide of issues per repo (except `firebase-functions` which seems ok).

---

Then... we could look at new requests. :)


## Online Rules Simulator: Stop maintaining it / move to local???

Since Firebase now (after 2020) has full emulation, maintaining the online Rules Simulator makes little sense. In practice, people can develop without it.

Keeping old products "hanging" without proper deprecation is a bad choice.

- it complicates things (including documentation)
- it confuses developers

I would simply declare the online Rules Simulator deprecated. There are some unique features it has (ability to closely see how a certain rule gets evaluated), but people might not miss them.

If anything, this functionality **should be in the local Emulator UI** and not in an online tool. Leave online for configuration, deployment and monitoring, only.

## Online Rules Simulator

Feedback about the Online Rules Simulator is striked over. As you can see, maintaining it would need resources.

<strike>
### Uniformity between the online Rules Simulator and the local Firestore emulator

This is mentioned widely on the Internet, but it took me a while before it really bit.

>![](.images/rules-simulator-no-resource.png)

I cannot use the same `validSymbol()` for both reads and writes, in the simulator.

It seems the Simulator tries to say that it has `request` but there is no `request.resource`. The local emulator always has this (*) - even for gets. These two seem to be either from different code base, or from different times.

>(*) Jul 10th, local emulator is (`firebase` 8.4.3) is giving "Property resource is undefined on object. for 'list' @ L19" if `validProject` is enabled for reads. This may have changed, but consistency across all: cloud server, local emulation, cloud simulation would be HIGHLY APPRECIATED!

They are both crucial for development - complementing each other. But if their logic conflicts, it just adds to the pain of Firestore Security Rules development...

Surely something that deserves to get fixed.

i.e. Target:

- there should not need to be any special coding in Security Rules, for having them run on the online Simulator (or the local emulator)
- having contradictory evaluation of rules should always be treated as a bug, by Firebase personnel

### Online Simulator syntax highlighting of `/* ... */`

Block comments are allowed by the Security Rules evaluation, but not reflected in the syntax highlighting.

![](.images/firebase-simulator-block-comments.png)
</strike>

### Ability to insert "current server date" in the Firebase console <strike>(and Rules simulator)</strike>

![](.images/firebase-wishes-server-date.png)

>♨️: With the online simulator, lack of this currently (Mar 2020) prevents testing for rules that expect server side timestamp in a field (e.g. `created`, `removed`).

INITIAL suggestion:

A means in the date picker to get the current time. (I don't know of the time zones applied: is it server's time, UCT or my local time zone).

ALTERNATIVE suggestion:

Adding `FieldValue` to the `Type` drop-down would be more in line with the Firestore data model, in general. The user could then choose the server timestamp from there, to get the "current" time.

These two are slightly different ideas.


<strike>
### Firebase Rules playground (online) 'Build document' dialog (usability suggestion)

For more complex work, ability to copy-paste a JSON as the document would be welcome.

If we go by the dialog, ability to make changes to the previous document would be welcome.

>![](.images/rules-playground-build.png)

Here, the document contents are non-trivial. When I click `Build document`, instead of being able to add or remove fields, I need to start creating it all from scratch.
</strike>


<!-- hidden (not that relevant... haven't used coverage, in 2021-22)
## Firebase emulator API

See [Generate Test Reports](https://firebase.google.com/docs/firestore/security/test-rules-emulator) (Firebase docs)

For seeing test coverage, one needs to use a URL such that:

```
http://localhost:6767/emulator/v1/projects/<project_id>:ruleCoverage.html
```

*Here, the "project id" is what we name "session id". The run of a set of tests.*

This is okay when one uses a small set of stable test ids (and we'll likely go that way, because of this).

It would, however, be nice to be able to see the available "project id"s from the API. E.g. GET to `http://localhost:6767/emulator/v1/projects/` could list these, as a JSON array.[^1]

[^1]: Currently (Mar 2020), that gives a 404.
-->

## 🌶 Firestore Security Rules emulator: a "dry run" mode

When I first used the rules unit testing library (`@firebase/testing`, now `@firebase/rules-unit-testing`), I somehow supposed the underlying data would not get changed. It does.

Then created a means to protect the tests from this side effect. That means is now the [firebase-jest-testing](https://github.com/akauppi/firebase-jest-testing) library.

If the Firebase emulator provided a "dry run" flag, the library could get rid of the locks it now needs. This might also improve test performance, a bit.

The flag can also be a configuration for a particular project id, but since configuration at the moment (Aug 2020) is all over the place, I'm not advocating that unless it first gets gathered in a centralized way (e.g. `firebase.json` and emulator command line flags; away from source code!).


## 🍎🍎🍎Testable billing for Security Rules

Asking about how many "reads" a certain security rule causes has been mentioned in community forums (especially newcomers).

Would you be able to add this to the emulator so that we can compare the reported "reads" count automatically to expected ones. I would add this as part of the security rules tests.

This makes the billing testable.



## JS client (emulation), Cloud Functions: Config should not be in code

The configuration story for Firebase seems unclear (Jul 2020). 

While there is a config file (`firebase.json`), it does not consistently collect all Firebase configuration into itself, as it could.

In addition, configuration exists in:

- JS client code, for setting up emulation
- Cloud Functions code, for setting up regions

Obviously, we can live with the current implementation. This is more of a design / philosophical thing. When doing incompatible changes in the future, Firebase people could consider whether configuration can be brought out from code.


## Cloud Functions: ability to configure the default region in one place

**Edit 16-Feb-2021:**

It seems this boild down to two, separate issues:

- having to provide the Functions' region **in code**, as opposed to configuration.

   There should be a one clear place where one can say "I wish to use location ... for this project". If more complex use cases require more, that is fine, but the poor man's case must be simple!

- having to provide the region **in front end client** (for callables).

   Surely the Firebase JavaScript library can figure it out? Again, for complex cases there may be other requirements, but the 90% use cases should not need the location to be sprinkled around here and there.

---

Overrides to regions can only be done on a function-by-function basis. This leads to the Internet [recommending](https://stackoverflow.com/questions/43569595/firebase-deploy-to-custom-region-eu-central1#43572246) things like a `regionalFunction` value - the approach taken also in this repo.

1. A developer should have a clear place to override the default region for their functions.
   - this place could be the `firebase.json` file?

2. The client should "just pick up" such a setting.

>Firebase says (@puf on Twitter) that the `__` configuration is only for hosting.
>
>To a user, it does not really seem that way, having `storageBucket`, `messagingSenderId` etc. How would `functionsDefaultRegion` be any different?

The [environment configuration](https://firebase.google.com/docs/functions/config-env) provides a solution to the first problem (not having regions in code). It should just be more clearly communicated in Firebase docs. (instead of recommending to stamp the region in code)


## Firestore JavaScript client could provide `Date`s?

Timestamps in the Firestore data are provided as: `{ seconds: int, nanos: int }`. There is a native JavaScript presentation for dates, `Date`, and the Firebase client provides `.toDate()` method for converting to it. 

But why is this not made automatically? What would be the use case that needs "more resolution" than a normal `Date`?

Are the timestamps even having more than 1ms resolution? Firebase docs suggest this, but let's see on server timestamps.

>tbd. Check some server-timestamp fields (in code); what are the `nanos` values for them?

For a document database (not real time database) I don't see a reason for sub-1ms resolution.

It would make sense that the client provides such data in the normal abstraction of the platform. Now the application code must convert individual fields.

Two ways to make such a change:

1. Derive from `Date` (or make a class that behaves the same), and have it also provide the `.seconds` and `.nanos` for backwards compatibility.
2. Have a global switch somewhere (initialization of the `.firebase.firestore`?), so application programmers can select the "old" or the "JavaScript" way.

---

*Edit*: Brought this up at [@exp API Discussions](https://github.com/firebase/firebase-js-sdk/discussions/4573) and got the following response from Firebase:

- `Timestamp` offers sub-ms resolution (and a code sample I don't comprehend, even after reading it 4 times, showing why that matters)
- all Firebase platforms provide dates as `Timestamp` - not the native ways

---


## Security Rules: could allow set comparison without `.toSet()`

Sets are great. However, their use is a little verbose, at the moment (8.6.0).

It's a very common practise (shown also in Firebase samples) to compare the outcome of a `diff` to a constant set. This requires a `.toSet()` at the end:

```
diff().removedKeys() == ["removed"].toSet()
```

If the `.toSet()` is removed, one gets a warning:

```
⚠  ../firestore.rules:53:73 - WARNING The sub-expressions are not comparable, so this comparison will always return false.
```

Instead, the Firebase parser could imply a `.toSet()` when a set is compared with a constant array. This would make people's rules less verbose, and not break any existing code. So this would work:

```
diff().removedKeys() == ["removed"]
```

More readable? :)


<!-- hidden; Not really an issue. We also don't use '__' any more - baked in config is fastest (but something Firebase cannot do for us).

## Firebase emulation: expose in the client, whether it's running against local emulator

We now jump through hoops to get the front end know that it's running against an emulator.

The JavaScript library probably knows this. Can it somehow tell it to us?

This would mean the `window.LOCAL` mode can be taken from the library, instead of the build system and `import.meta.env.MODE`.

Suggestion:

- bring all the configuration of the server (emulator) available in one end point (preferably `__`)
-->


## Performance Monitoring: the concept of version

Firebase Performance Monitoring has the concepts of version and build for mobile (iOS, Android) apps, but not for web apps (Sep 2020).

Isn't that a useful concept even when versions presumably update faster? I'd like to be able to tell Firebase the version and build (for production), preferably in `initializeApp` itself.

Firebase Performance Monitoring could then provide parity with the mobile versions.


## Firebase Auth does not allow data URLs for `.photoURL`

It guards the URL formatting too strictly. [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) are generally valid, and in mocking users it makes sense to provide an icon as a data URL string. No need to host separate pictures.

Also, Firebase error message states the data URLs not to be "valid URLs". But they are. Just not for Firebase.

```
FirebaseAuthError: The photoURL field must be a valid URL.
```

**To reproduce:**

- Change the `dev.photoURL` in `packages/app/local/users.js` to a data URL (starting `data:...`).

- `npm run dev` and open in browser.


<!-- Have we seen this, recently? 2022
## Firebase JS SDK: please update the Changelog *before* publishing ‼️‼️

The current (2020-21) workflow at Firebase seems to be:

- publish an `npm` package
- (maybe) change the website, and let the users wait until changes propagate

>This still happens.
>
>|version|`npm` release|Changelog update|days it took|
>|---|---|---|---|---|
>|9.6.11|14-Apr-22|not on 19-Apr-24...|10+ = 🧘|

**This is not user friendly**: I see with `npm outdated` that a new `firebase` package is out (8.2.9). What might it contain?

>![](.images/changelog-at-8.2.8.png) 

Yeah, right. 

Ping for a <strike>day</strike> week or so and eventually 8.2.9 info is out. **No other software package I use suffers from this**. Wouldn't it be nicer to have the release information out promptly, after the release? I'm okay with a 10..20 minute delay but hours. Not cool.
-->


<!-- hidden (need checking whether the option really is visible to developers; if not, remove)
## Firebase JS SDK: educating on differences of `local` persistent options 

Firebase docs has a great [Authentication State Persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence) page on the differences of the local, session and none persistence models.

The JS SDK has two ways of implementing the local: 

- indexedDB
- localStorage

Does the developer need to be aware of these, at all?

[This thread](https://groups.google.com/g/firebase-talk/c/wgSvjniKPQI) (Firebase discussion groups, may be restricted) has a comment (Mar 2018):

>I recommend that you stop relying on internal implementations of how we persist Auth state as that is subject to change and instead use our public APIs. Basically, anything that is not part of our public API is subject to change.

On the other hand, the author got the feeling that in the `@exp` API's `initializeAuth`, one should / can somehow make decisions of this kind. But the [documentation](https://modularfirebase.web.app/reference/auth.initializeauth) of that function is currently (7-Mar-21) giving no details.

This is LIKELY a BOGUS thing to even ask. Let's presume IndexedDB is the implementation and the developer does not need to care! :)
-->


## API inconsistency: `getFunctions` behaves like `initializeFunctions` (which doesn't exist)

The Modular JS [API](https://firebase.google.com/docs/reference/js/functions) is inconsistent.

For some reason, there is no `initializeFunctions` but the `getFunctions` takes parameters (which it doesn't, on other subpackages).

```
const fns = getFunctions(fah /*, regionOrCustomDomain*/ );
```

>Mentioned in [#5170](https://github.com/firebase/firebase-js-sdk/issues/5170).

## API inconsistency: `connectAuthEmulator` takes a URL whereas others prefer host + port

```
connectAuthEmulator(auth, AUTH_URL);
connectFirestoreEmulator(firestore, 'localhost',FIRESTORE_PORT);
connectFunctionsEmulator(fns, 'localhost',FUNCTIONS_PORT);
```

Mentioned in [#4781](https://github.com/firebase/firebase-js-sdk/issues/4781).


<!-- Not really an issue. Using priming with DC works fine.

## FR: Ability to cloak as admin, with Firestore emulator (documenting this)

The Firestore emulator treats access token `"owner"` as a free-pass, already:

>We treat "owner" as a valid account token for the default projectId.

Did not find this behaviour documented, though. How can I - with the client side Firebase JS SDK - make requests to the Firestore emulator that would bypass Security Rules?

This would be useful for priming the emulated data. Instead of needing to bring in `firebase-admin` (a new dependency), one could prime the data with the client side JS SDK.

>Note: Firebase provides the [import/export](https://firebase.google.com/docs/firestore/manage-data/export-import) functionality for this, but I and some other developers prefer to work with JSON instead of binary blocks. This for example allows them to be hand crafted.

Work-arounds:

1. Using `firebase-admin` (obviously)
2. Using import/export
3. ...looking for the right way...
-->

## Using Firebase from a worker thread (documentation, maybe..)

This didn't seem possible, and the author created a "callables" client themselves, using normal REST API.

What is missing is:

- recognizing that Firebase client can be useful not only in the browser's main thread, but also in its workers
- creating a mechanism that would tie the client in the worker to that in the main thread

Ideally, calling `getAuth()` in the worker would automatically tie to the main thread, somehow, and no `initializeApp` would be needed, in the threads.

Alternatively, one would be able to initialize `auth` with an auth token, passed to the worker e.g. in its initialization (the source code does this, see [`packages/app/src/central/`](packages/app/src/central/)). The author currently (Aug 2022) found no way that this kind of initialization would be possible.

Yet another way, if Firebase doesn't want to bind the browser threads in any way, is to simply **document that Firebase authentication within a worker thread isn't possible** (or that one needs to do it completely separated from the main thread). Currently (Aug 2022), the author is not aware of any mention of such.


## Cloud Functions: relationship of "task functions" vs. "scheduled functions"?

These are described below each other at:

- ["Enque functions with Cloud Tasks"](https://firebase.google.com/docs/functions/task-functions)
- ["Run functions on a schedule"](https://firebase.google.com/docs/functions/schedule-functions)

- [x] What is the difference between them? (except different backends, first runs on Google Cloud Tasks, the second on Google PubSub)

   A: Obviously (in hindsight!) "Cloud tasks" tasks are not scheduled, but one-timers. They need to be separately triggered (see [Enqueue the function](https://firebase.google.com/docs/functions/beta/task-functions#enqueue_the_function)). This was NOT IMMEDIATELY CLEAR to this author, only realized it on the third time reading these pages.
   
   A gentle introduction on where to use Cloud tasks (and separately, for the scheduled functions) would set the reader's context right. There are so many similarities between the two, this crucial difference seems easy to miss.

- [x] When should I opt for one, over the other? 

   A: You run one-off tasks (backup can be; though it can also be a scheduled one!!), use Cloud Tasks. You want a Cloud Function by a schedule, use "scheduled functions".


## References

- [Firebase Support Form](https://firebase.google.com/support/troubleshooter/contact)

