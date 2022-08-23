# Make it Yours!

>You've now expected to have gone through the rest of the repo. You have the sample application running in the cloud, and you've set up CI/CD for it, as well. You've learned how to do operational monitoring on that app.

Now, let's turn the focus around - onto Your app.

## Replacing the sample app with yours

*tbd. This section is upcoming. The plan is to have the samples in git subrepos. This way, you can switch from the sample app to your own nicely.*

*Until then, just tune the `packages/{app|backend}/**` to what your needs are.*

<!-- tbd. update, once we're there. Explain how to re-forward the submodules. -->


## Multiple deployments

Each Firebase project carries its own data, users and deployment status.

Depending on your needs, you can have 1, 2, or more deployment projects. It's fully up to you.

- 2 deployment projects can be used for having separate "staging" and "production" instances
- More than 2 deployments is needed if you wish to run the same application for multiple end user organizations (each having their separate users, and data, but common code)

### Creating

You decide the name of the target environment by setting the `ENV` variable. This is used throughout the repo. As with the default (`ENV` == `staging`), you first visit the `first` folder to make an initial deployment. This creates the `firebase.{environment-name}.js` file that stores access values.

Other parts of the repo then fetch the access values from that file, as long as you keep pointing to the right one, by the `ENV` environment variable.

### CI/CD

Understanding the foundation, you should be able to revisit the CI/CD guidance, and set up GitHub and Cloud Build jobs, to cater to your needs, also for multiple targets.

>Note: At this point, development needs start to vary. Thus we're not even aiming to hand hold all the way, but hope you will be successful on your own, from here.

### Operational monitoring

Depending on your needs, you can set up operational monitoring separately for each of your target environments - or set up a dedicated Firebase/Google Cloud project just for the monitoring.

As with CI/CD, we leave you here, hoping that whatever you plan to do, you'll be successful with it!!


## Notes on staging

### Development environment?

Some developers are used to online "dev" environments. With Firebase Emulators doing a good job for development, the need for such is reduced, or removed. If you need one, it's just setting up another online environment for the person or team needing it.


### Sharing the staging (optional)

You can share the staging access values with the team by simply adding `firebase.*.js` to the version control. This means your team members don't need to create those files on their own, after having cloned the project.

>Note: The values are not really secrets. Anyone having access to your web app's URL is able to figure them out. Firebase hosting openly provides them in the `/__/firebase/init.js[on]` end points.

<p />

>Note: If you add the access values in a public repo, GitHub will warn you about it. It thinks the values are secrets, because of the mention of `apiKey`. If you learn, how to silence that warning, please send a PR on this document.


## Remove the branding

Once you've replaced the `packages/{app|backend}` with your own app, you have a choice to make.

You can either "cut the cord" to this repo, and no longer pull updates from its changes. (You do this e.g. by editing the `.git/config` file).

Or you can *continue* to receive updates, as this repo changes.

Whichever way you go, we request you to remove the *branding* associated with the repo:

```
$ make de-brand
```

### Mentions of "GroundLevel"

You may choose to leave these - up to you. To find all mentions:

```
$ git grep GroundLevel
```

### The license

Notice the `LICENSE.md` for the repo.

- [ ] You can now remove the preamble that mentions the branding.
- [ ] Please read through the license.

   >The above copyright notice and this permission notice shall be included in all
   >copies or substantial portions of the Software.

To be clear, this license applies to the repo at large. You can license and copyright your app (`packages/{app|backend}`) wholly separate from this. The Git submodule relationship is seen as a licensing boundary, just like dynamic linking is.

If in doubt, please be in touch with the author.

Thank you!

Be your bugs few - and your users happy!!

😀