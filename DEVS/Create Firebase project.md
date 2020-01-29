# Create Firebase project

Create a Firebase project in the [console](https://console.firebase.google.com):

>![](.images/pick-me.png)

Register your Firebase web app online.

You don't need to copy-paste the particular values provided (SDK) to the project. Firebase can automatically tie your app to the project, if:

- you log in with `firebase login`
- you serve Firebase code from special `/__/` folder

This means authentication is completely separated from source code which is AWESOME! 😋

Can you log in:

```
$ firebase login
```

Then, we'll tie the local folder to the Firebase project you created online:

```
$ firebase init
     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  <snip>

? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices. Hosting: 
Configure and deploy Firebase Hosting sites, Emulators: Set up local emulators for Firebase features

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add, 
but for now we'll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: vue-rollup-example (Vue Rollup example)
i  Using project vue-rollup-example (Vue Rollup example)

=== Hosting Setup

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build's output directory.

? What do you want to use as your public directory? dist
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
✔  Wrote dist/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!
```

Firebase configuration is in `firebase.json` and `.firebaserc`.

Last yards.

Try opening [https://your-project-id.firebaseapp.com/](https://the-sim-270120.firebaseapp.com/) (replace your Firebase project id).

```
$ firebase deploy
```

Try again. See a difference?

Your site should be up, now. 🌟


