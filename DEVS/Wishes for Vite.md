# Wishes for Vite


## Env values from config

Doesn't seem to work (Vite 0.20.10).

Not sure if even intended. See -> [https://github.com/vitejs/vite/issues/417](https://github.com/vitejs/vite/issues/417)

We can do this with a custom mode, but those are expected to be only "production" or "development", so swimming against the tool, there.

Or.. if we can set env directly from the command line (`--env x=y`) that would be tidiest.

The reason this is a problem for us is that there are *two* configurations for development: with or without the Firebase emulator.

I'd also like to be driving them simultaneously (so modifying files is not getting votes)....

---

Could try module aliasing.



## Configurable path to `index.html`

### Case 1. Ability to place it in `public/index.html`

It feels weird that `index.html` must be in the project root. There are plenty of files there, mostly related to tools and documentation.

Placing it under `public/index.html` would make things more peaceful.

Files under `public/` are told to be delivered to the deployment unmodified. This could be done for `index.html` as well.

Currently, it gets chopped quite badly (especially since in this case we have code in there):

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!--PROD Favicon
    <link rel="icon" type="image/png" href="favicon.png">
    -->

    <!-- tbd. make 'set' work if we generate both 'index.dev.html' and 'index.html' (production)
    -   from the same source.
    -->
    <!--SET DEV,PROD $FB_UI https://www.gstatic.com/firebasejs/ui/4.5.0 -->

    <!--
    - Firebase UI
    -   - latest versions -> https://github.com/firebase/firebaseui-web/releases
    -
    - This is only needed in 'SignIn.vue', but there's no injection to 'head' in Vue.js (seems, by design?) so in
    - development it was easiest to have it here. It likely gets cached, and everyone needs to come through the
    - signin at some point, so there's little benefit in injecting it just for that one page.
    -
    - NOTE: It's not unlikely that one day we'd read the source of the Firebase UI project and implement the parts
    -     needed (we don't use/need all authentication flows) as a Vue-specific component. This a) does not seem to
    -     be as great quality as other tools we use and b) we're not getting it from npm.
    -
    - See discussion -> https://stackoverflow.com/questions/41710898/injecting-into-head-in-vue-js
    -->
    <!--DEV,PROD -->
    <script defer src="https://www.gstatic.com/firebasejs/ui/4.5.1/firebase-ui-auth.js"></script>
    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.5.1/firebase-ui-auth.css" />
    <!-- -->

    <!--
    - Set up globals
    -
    - Some things don't need to come via the 'import' mechanism. These are better to set up already here, since
    - 'import's get evaluated at once for a module, and modules needing the globals would faint.
    -->
    <!--DEV,PROD -->
    
    <!-- -->

    <!--PROD Firebase initialization
    <script type="module">
      // Presuming Firebase hosting:
      import config from "/__/firebase/init.js"
      firebase.initializeApp(config);
    </script>
    -->
    <!--DEV Firebase initialization -->
    
    <!-- -->

    <!--PROD Application
    <script type="module" src="/dist/bundle.esm.js"></script>
    -->
    <!--DEV Application -->
    
    <!-- -->
  <link rel="stylesheet" href="/_assets/style.b86c7168.css">
</head>

  <body>
    <div id="app"></div>
  <script type="module" src="/_assets/index.077f82f6.js"></script>
</body>
</html>
```

All the code is removed, and placed in the bundle, unreadable. :(


Reason for bundling in Vite is load times. But since index.html gets read separately, there is no change if scripts are allowed to remain within it, unmodified.


### Case 2. separate index for dev and production

The idea was that a production `index.html` would be generated from the development `index.html`, by a build time script.

This becomes moot, since Vite does not allow a configurable path for it. 

---

Way out. 🚪

Let's do production builds directly with Rollup. 





