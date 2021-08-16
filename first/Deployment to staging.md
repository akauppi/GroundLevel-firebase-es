# Deployment to staging

><img src=".images/staging.svg" width=500 style="background-color:white" />

For development, it is good to have a project online where you can see your changes in a real environment. These are called "staging" projects and we'll set up one now, for you / your team.

>Note: Some developers may be fond of "dev" environments. With Firebase Emulators doing a good job for development, the need for such is reduced, but if you need one, it's just setting up another staging environment (for the person or team needing it). That is, you can have any number of staging environments you want. More about this later..

We'll do an initial deployment using a script prepared for this. It uses a temporary Docker container to sign you into Firebase, lets you select the right project, picks the access values and deploys the backend.


## Create the Firebase project

Follow the instructions in [0.1 Firebase](https://github.com/akauppi/GroundLevel-firebase-es/wiki/EN-0.1-firebase) (Wiki).

>You *will* need a credit card for creating the "Blaze" plan (and to deploy the default back-end).

## Create `firebase.staging.js` and deploy

Start the script:

```
$ npm run initStagingAndDeploy
```

This starts a temporary Docker container and asks you to log into the Firebase project.

![](.images/create-staging.png)

Press `n`.

![](.images/create-staging-auth.png)

Copy-paste the URL and open it in a browser.

![](.images/firebase-login-wohoo.png)

Close the browser window.

![](.images/create-staging-add-project.png)

Select the Firebase project you want to use for staging.

>Firebase CLI asks an alias for the project. Give it *anything* (e.g. `abc`). This info will be forgotten once we exit Docker.

![](.images/staging-access-values.png)

The script picks downloads access values for the project and prepares `firebase.staging.js` for the front-end development.

![](.images/staging-deploy.png)

This last bit deploys the backend project.


<!-- #later: `initStagingAndDeploy` needs this to be implemented #help ;)
## Using multiple staging projects

You can replicate the steps above with multiple projects. Declare the env.variable `ENV` with the name of your staging environment. 

e.g.

```
$ ENV=team npm run initStagingAndDeploy
```

This will create the file `firebase.team.js`.
-->

## Sharing the staging (optional)

You can share the staging access values with the team by simply adding `firebase.staging.js` to the version control. This means your team members don't need to take the above steps, when they clone the project.

>Note: The values are not really secrets. Google Cloud docs claim they would be - but Firebase takes a more relaxed approach in its docs. Anyone having access to your web app login page is able to figure them out. Firebase hosting openly provides them in the `/__/firebase/init.js[on]` end points.

To share the file:

1. edit `.gitignore` and remove (or comment out) the line excluding `firebase.staging.js`
2. add `firebase.staging.js` to the git repo

You may further want to consider removing `init-staging/` folder.

---

**This may be your first deployment!**. Let's celebrate for a while!! 🎉🎉🎪🤹‍♀️🎺

The back-end is now deployed. 

For a longer term solution, have a look at the `ci` folder on how to set up CI/CD.
