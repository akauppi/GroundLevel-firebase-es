# Make it Yours!

By now, you have deployed the sample app to your own Firebase project. It's now an independent *instance* of that application, unattached to the one run by the original authors.

The obvious next step is to make changes to it.

>![](.images/repo-relations.png)

*Figure 1. Relation of the repos* <sub>[source](https://docs.google.com/drawings/d/1hryjNmrH8A04NNpIBBTWMkGabpLAawsN1xiGY9c7ZBE/edit?usp=sharing)</sub>


Important catches from the figure:

- `backend` repo contains development, testing and deployment of the Firebase back-end details
- `app` repo is where the app development happens. It has a development time dependency to `backend` which allows the back end to be locally emulated (you'll learn more about this, soon)
- `web` is the deployment of the front end. It does inject certain operational pieces to the mix that the development does not need to be concerned about.

You don't need to grasp all of this. It should become clear when we walk through the repos and their roles.

Let's start with the front end!


## Front end

Each of the repos has more details within its own README's. The purpose of this walk-through is to present you to them, so that you can look more in detail later. Some commands are revealed here, but for details, have a look within the repo.

Take an empty terminal and a place to clone the front repo:

```
$ git clone git@github.com:akauppi/GroundLevel-es-firebase-app.git

$ cd GroundLevel-es-firebase-app

$ npm install

$ npm run dev
...
[init]   Dev server running at:
[init]   > Local:    http://localhost:3000/
[init]   > Network:  http://192.168.1.62:3000/
```

Open the browser at [localhost:3000](http://localhost:3000). Do you see a meaningful UI? 

Keep the server running. :)

### Dev modes

The repo supports two kinds of development environment:

|mode|back-end|
|---|---|
|`dev`|locally emulated, primed with some data|
|`dev:online`|in the cloud, staging/production data, changes persist|

There's more discussion about the pros/cons of these two approaches in that repo. Here, we use the `dev` workflow which means that a local Firebase emulator is launched and your changes have no implications outside of your computer, at all.

### Edit time!

Launch your favourite IDE and let's check the folder system.

>Note: If you don't have a favourite IDE, IntelliJ [WebStorm](https://www.jetbrains.com/webstorm/) is the author's favourite. It comes with a 30 day trial, after which 59/47/35 eur/year (nice declining pricing system!). For a free alternative, many find [Microsoft VS Code](https://code.visualstudio.com) good enough.

Pay attention to the following folders:

```
- cypress
- init
- public
- src
```

**cypress/integration** contains tests for the front end. In the sample app, any feature is expected to come with a test, but this is really up to you / your team to decide. Some test more - others less.

Visiting the [Cypress.io](https://www.cypress.io) website is worth it, to dive into their testing ideology, and to learn about the product!!!

**init** contains a kind of bootstrapping stage, created for the Vite development stack. It's needed to run your development builds but is not part of the application provided to `web` repo. If you code something there, it's only used in dev modes.

**public** contains "static assets" (pictures etc.) for your web application. This is a pretty standard convention when building web apps.

**src** contains the source code of your front-end app.

The Vite stack we use watches your sources. If you make changes, they should automatically be reflected in the browser you have open (you do still have it, right? :). Let's try!

You can edit *anything*.

Let's see what the `src` folder has eaten:

![](.images/src-eaten.png)

Hmm.. `app.js` looks like the entry point and `App.vue` as the main page. (We're not going further to the layout - it should be obvious and reflect the structure of the sample app).

I'll change the color of the "EMULATION MODE" box to orange:

```
  #mode.devLocal {
    display: block;
    background-color: orange;
    &:after {
      content: 'EMULATION MODE';
    }
  }
```

Change to the browser. Before you're there, the change should already have been performed!!!

You can create new files, route them, whatever, and the browser should simply be able to keep up and refresh. If not, do a manual refresh.

>Note: The UI framework used in the sample app is Vue.js 3. It's great, but only an implementation detail of the `app` repo. You can use e.g. Svelte, React, or something else if you wish. You might need to re-engineer a bit since Vite is from the same lab as Vue, but.. good luck!
