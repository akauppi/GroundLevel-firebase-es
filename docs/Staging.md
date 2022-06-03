# Staging in detail

For development, it is good to have a project online where you can see your changes in a real environment. These are called "staging" projects and we'll set up one now, for you / your team.

<!-- tbd. #rework
><img src=".images/staging.svg" width=500 style="background-color:white" />
-->


>Note: Some developers may be used to "dev" environments. With Firebase Emulators doing a good job for development, the need for such is reduced, or removed. If you need one, it's just setting up another staging environment for the person or team needing it. That is, you can have any number of staging environments you want.


## Multiple staging environments

Just prefix `ENV=abc` to any of the `npm` commands and they'll use `firebase.${ENV}.js` access values.

To create such a file, run `ENV=abc npm run first`, or simply fill in the file manually, based on the template from the first environment.

<!-- hmm... should we have this?
For a longer term solution, have a look at the `ci` folder on how to set up CI/CD for your multiple environments.
-->

## Sharing the staging (optional)

You can share the staging access values with the team by simply adding `firebase.*.js` to the version control. This means your team members don't need to take the above steps, when they clone the project.

>Note: The values are not really secrets. Anyone having access to your web app login page is able to figure them out. Firebase hosting openly provides them in the `/__/firebase/init.js[on]` end points.

<p />

>Note: If you add the access values in a public repo, GitHub will warn you about it. It thinks the values are secrets, because of the mention of `apiKey`.


