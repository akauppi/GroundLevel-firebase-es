# Security

This file is a kind of placeholder and discussion for all things having to do with security.

The principle is in designing the *workflow* right - not trying to tighten leaks of a bad workflow.

Keep in mind that security is contextual. A one-man open source project's security needs are different from those of a startup are different from those of a sensitive company. The author hopes this repo can be useful for all of them, but you need to use your own judgement to see what matters to you / your team / your project.

Let's get started!


## Development security

This is about deployment credentials, and about making changes to the production-headed Git branches.

We'll only cover the first, at least for now. 

*Please suggest ways to have "four eyes principle" applied to GitHub projects; the author doesn't know, how this can be done.*


### Firebase credentials

The traditional (as of 2022) way of dealing with Firebase projects is via the Firebase CLI. You `firebase login`, after which you can `firebase deploy`. Then, you can `firebase logout`. While logged in, your authentication tokens are stored in the local file system, for any process to see them.

We avoid this.

**1. CI/CD**

Deployments via CI/CD are done by the same GCP projects that also run the project in the cloud. This way, access rights to tune such projects can be kept to the few people (IT admins) who would anyways have them.

No enlarged attack surface. 😊

What remains is to make sure that the `master` branch in GitHub doesn't get malicious code, intentionally or via e.g. dependency updates.

**2. Manual deployments**

Handled by the Docker Compose setup in `first/` folder, we *do* use Firebase CLI but do so within a *disposable Docker container*. Thus, no trace of the login should be left on the developer's machine.

>Note: If the manual deployment fails, the credentials are kept cached. This helps repeated attempts to deploy. After a successful deployment, the cache is cleared, and one needs to re-authenticate if running `first/deploy.sh` again.

<!-- disabled; confusing.. (needs rewording)
<p />

>Notice how the browser is used as a trusted environment. It would be difficult for a native software to launch something, then launch the browser, then understand which button to press in the said browser, in order to authenticate. It's really like a captcha - checking that the human is in the loop.
-->

### GCP credentials

We do use the `gcloud` CLI command in setting up the CI/CD.

This seems reasonable to the author, especially if you do `gcloud revoke <email-address>` after the tasks.

However, it does happen on the main development machine, so *during the time you are doing the actions* any software on your machine could impersonate as you, and do things behind your back.

**Suggestions: use a separate local account for `gcloud`**

If you are concerned about the above, the easiest way would be to create a secondary user account (eg. `hardwood`) from where any high security actions would be launched.

This really falls on those persons within your organization who even have the rights to eg. create new GCP projects. Even in a startup, it may be good to keep this in hands of 1-2 people, so there is consistency on how the cloud is managed.

**Suggestions: wrap `gcloud` within Docker Compose**

This would be a similar approach to that taken in `first`. Another benefit is that one wouldn't need to install `gcloud` on one's host computer.


### `npm` dependencies

This is the most likely place where malicious code would leak into your system.

`npm` has multiple problems, from a safety standpoint.

Running builds essentially allows *any* code in your dependency tree to run on *your account* with **full access rights**. It's something we would likely not want to think about, right?

So it's not (only) about what might get into the deployed web app. It's about how `npm` dependencies can harm your system.

**Suggestion: wrap Node package management**

The author is thinking of making this. There are other benefits as well.

Once done, `npm` (or other Node package manager) runs would only have access to a limited (mapped) folder tree, not all of the host.


### Why the paranoia?

Why not? 

By thinking about these things proactively, we reduce the chance of *bad things* happening to the product that the developers use dear hours to build and operate. The solution tries to be such that it *does not introduce friction* to your development processes (i.e. slow you down).

In order to *really* be prepared, you should likely have **even more paranoia** ;) and arrange regular emergency drills, where the idea is that some bad apple got to the lot and now X% of your developer machines are compromised.

Can you do that?

<!--
## Operational security

tbd.

- access to the Firebase database contents (nothing to say??)

Write once we have something meaningful to say. 😇
-->

---

*Please suggest changes to this text in the GitHub Issues / Discussions if you feel it could be shorter / stronger / better...*