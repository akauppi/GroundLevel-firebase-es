/*
* src/router.js
*
* Based on -> https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication
*
* We do a delayed (async) router generator, based on the 'firebase.auth().currentUser' being known. This delays about
* 300..500ms but ensures the authentication system is up, when the router needs it. No need for promises, later.
*
* Note: tried multiple approaches before this. Initializing Firebase before Vue (and Vue router), dealing with auth
*     info as a promise always. Each of them has down sides (and the delay is inevitable somewhere). The router is
*     the _only_ place where the info really needs to be (since if the user ends up on a protected page, we already
*     know authentication happened). Thus, embedding a part of Firebase in here. :)
*/
assert(true);
assert(firebase && firebase.auth);

import { createRouter, createWebHistory } from 'vue-router';

// Pages
//
// Note: Static import is shorter and recommended [1]. However, also the dynamic 'await import('./pages/Some.vue')'
//      should work. ESLint dislikes it, though. (May 2020)
//
//    [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
//
import Home from './pages/Home/index.vue';
import SignIn from './pages/SignIn.vue';
import Project from './pages/Project/index.vue';
import NotFound from './pages/_NotFound.vue';

// Turning Firebase subscription model into a Promise, based on:
//    -> https://medium.com/@gaute.meek/vue-guard-routes-with-firebase-authentication-7a139bb8b4f6
//
function currentFirebaseUserProm() {    // () => Promise of object|null
  return new Promise( (resolve, reject) => {   // () => Promise of (firebase user object)
    const unsub = firebase.auth().onAuthStateChanged(user => {
      unsub();
      resolve(user);
    }, reject);
  });
}

const rLocked = (path, component, o) => ({ ...o, path, component, meta: { ...(o && o.meta || {}), needAuth: true }});
const rOpen = (path, component, o) => ({ ...o, path, component });

let routerProm;   // available for 'routes'??? (trying to work around a cyclic dependency)

// Template note: You can use '.name' fields for giving routes memorizable names (separate from their URLs). Chose
//                not to do this, and go for the shorter format (best when there are lots of routes).
//
// Note: When coming here, the server has already tossed 200 to the client. If you wish proper 404 pages, do that at
//      the server config.
//
const routes = [
  rLocked('/', Home /*, { name: 'home' }*/),

  // Notes:
  //    - 'final': we provide the query parameter as a property so the component does not need to do parsing.
  //    - 'routerProm': avoids a cyclical dependency
  //
  rOpen('/signin', SignIn, { props: route => ({ final: route.query.final, routerProm }) }),  // '?final=/somein'

  rLocked('/projects/:id', Project, { props: true /*, name: 'projects'*/ }),    // '/projects/<project-id>'

  // Note: Not really important for us, just showing off dynamic component import.
  //
  //rOpen( '/easter',
  //  () => import('./pages/_EasterEGG.vue')    // tbd. How to make IDE (WebStorm) not red-underline 'import'?
  //),

  // Note: This covers HTML pages that the client doesn't know of. However, the status code has already been sent
  //    and it is 200 (not 404). Check server configuration for actual 404 handling.
  //
  rOpen('/:catchAll(.*)', NotFound )
];

// Note: Until JavaScript "top-level await" proposal, we export both a promise (for creating the route) and a
//    'route' value (which remains 'undefined' until the route is created - but users of it are behind routes so
//    they will never see that).
//
//    When the proposal has passed, and implemented in evergreen browsers, we can turn to just having 'router'
//    exposed.
//
//    See -> https://github.com/tc39/proposal-top-level-await
//
routerProm = currentFirebaseUserProm().then( _ => {

  const router = createRouter({
    history: createWebHistory(),
    //base: process.env.BASE_URL,    // tbd. what is this used for?
    routes
  });

  router.beforeEach(async (to, from, next) => {
    assert(to.path !== null);   // "/some"

    console.log(`router entering page: ${to.path}`);

    // 'to.matched' likely has the routes (including parent levels) leading to our page. We don't use route levels
    // (parent/children) (Jun 2020), so the array is always just one entry long. (Note: This is guesswork, '.matched'
    // does not have documentation in its source).
    //
    // For this, it is irrelevant whether we use '.some' or what not. Maybe we should use '.last' (the actual page).
    // Check this out properly, one day.
    //
    // Based on -> https://router.vuejs.org/guide/advanced/meta.html
    //
    console.debug("Before route, to.matched:", to.matched);    // DEBUG (could use central logging here!!! tbd.!!)

    const needAuth = to.matched.some(r => r.meta.needAuth);

    if ((!needAuth) || firebase.auth().currentUser) {    // since we waited for 'currentFirebaseUserProm', we can now trust '.currentuser'
      next();   // just proceed

    } else {    // need auth but user is not signed in
      console.log("Wanting to go to (but not signed in):", to);  // DEBUG

      if (to.path === '/') {    // no need to clutter the URL with '?final=/'
        next('/signin')
      } else {
        next(`/signin?final=${to.path}`);
      }
    }
  });

  return router;
});

export { routerProm /*, router*/ }
