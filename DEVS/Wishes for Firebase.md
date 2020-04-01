# Wishes for Firebase

Dear Firebase. You are awesome. If you ever run out of things to improve, here would be some ideas:

Hot list: 🌶

- ability to have immutable Rules evaluation (evaluation not changing the data set)
- ability to pick up if the rules file changes
- online Simulator and local Firestore emulator should have 100% same logic

🙏


## Cloud Firestore

### Uniformity between the online Rules Simulator and the local Firestore emulator

This is mentioned widely on the Internet, but it took me a while before it really bit.

>![](.images/rules-simulator-no-resource.png)

I cannot use the same `validSymbol()` for both reads and writes, in the simulator.

It seems the Simulator tries to say that it has `request` but there is no `request.resource`. The local emulator always has this - even for gets. These two seem to be either from different code base, or from different times.

They are both crucial for development - complementing each other. But if their logic conflicts, it just adds to the pain of Firestore Security Rules development...

Surely something that deserves to get fixed.

i.e. Target:

- there should not need to be any special coding in Security Rules, for having them run on the online Simulator
- having contrdictory evaluation of rules should always be treated as a bug, by Firebase personnel



### Ability to insert "current server date" in the Firebase console (and Rules simulator)

![](.images/firebase-wishes-server-date.png)

<!--
<strike>The dialog could have a "right now" or "server date" button, like the API allows a client to set a field to current date.

This would be even more valued, since it is not obvious to the user (me), whether I should fill in the UTC time, or a time in my local time zone. Having the suggested button would take away this consideration.</strike>
-->

>♨️: With the online simulator, lack of this currently (Mar 2020) prevents testing for rules that expect server side timestamp in a field (e.g. `created`, `removed`).

INITIAL suggestion:

A means in the date picker to get the current time. (I don't know of the time zones applied: is it server's time, UCT or my local time zone).

ALTERNATIVE suggestion:

Adding `FieldValue` to the `Type` drop-down would be more in line with the Firestore data model, in general. The user could then choose the server timestamp from there, to get the "current" time.

These two are slightly different ideas. My initial idea was more about usability (the date picker). If the server timestamp feature exists, there will be not so much value in the initial request.


### Firebase emulator API

See [Generate Test Reports](https://firebase.google.com/docs/firestore/security/test-rules-emulator) (Firebase docs)

For seeing test coverage, one needs to use a URL such that:

```
http://localhost:6767/emulator/v1/projects/<project_id>:ruleCoverage.html
```

*Here, the "project id" is what we name "session id". The run of a set of tests.*

This is okay when one uses a small set of stable test ids (and we'll likely go that way, because of this).

It would, however, be nice to be able to see the available "project id"s from the API. E.g. GET to `http://localhost:6767/emulator/v1/projects/` could list these, as a JSON array.[^1]

[^1]: Currently (Mar 2020), that gives a 404.

#### "Project id's" don't seem to matter??

I can use a query such as `http://localhost:6767/emulator/v1/projects/nosuch:ruleCoverage.html` and still get a valid response (there is no `nosuch` project). This is weird - would expect a 404.

Firebase tools v. 7.16.1.

>**Edit:** Instead, this is some kind of a caching problem. At times, the earlier results are available (e.g. changing project id in the URL from `abc` to `abcd`). Other times, one gets a 500.
>
>Someone at Firebase could have a look.
>Tested both with Safari and Chrome.

Also, I was surprised to see the results persist over emulator restarts. Wasn't expecting that, based on documentation.


### 🌶 Firebase emulator to pick up changes to the rules

The emulator could have a "watch" mode to help in development.

`firebase emulators:exec` takes some seconds to set up the emulator. It makes sense, for rules development, to have an emulator running in the background.

However.. currently (firebase tools 7.16.1) the emulator does not change its behavior when a rules file is changed.

Could we have a `--watch` mode that would? 🥺


### Firebase Rules playground (online) 'Build document' dialog (usability suggestion)

For more complex work, ability to copy-paste a JSON as the document would be welcome.

If we go by the dialog, ability to make changes to the previous document would be welcome.

>![](.images/rules-playground-build.png)

Here, the doc is non-trivial. When I click `Build document`, instead of being able to add or remove fields, I need to start creating it all from scratch.


### 🌶 Firestore Security Rules emulator: a "dry run" mode

It took me a while (several days) to realize that the allowed rule evaluations (create, update, delete) actually do change the data they operate on.

This is not necessarily needed, for evaluating security rules. One can build tests with the assumption that changes are not applied. This in fact makes tests more easy to build, in my opinion, since the underlying data model stays untouched.

Even if this were a good idea, for backwards compatibility the current behaviour must of course remain, as a default.

<strike>Would you (Firebase) consider an `--immutable` or `--dry-run` flag to starting the emulator. If used, it would not apply a succesful rule evaluation to the data.</strike>

Edit: The above does not work, since the emulator is a full `--firestore` emulator, not just for rules.

Another alternative for this could be for the `initializeTestApp` call to have a `dryRun: true` option:

![](.images/initializeTestApp.png)

Each project using `@firebase/testing` for rules testing uses this call. It would likely take some collaboration between the emulator and the client side library, to mark "don't take this set/update/delete seriously", but the change in application code would be just one line.


## References

- [Firebase Support Form](https://firebase.google.com/support/troubleshooter/contact)

