/*
* src/router.js
*
* This file is maybe most Magic 🎩 in the whole project. It helps to know Vue Router and the concept of front end
* routing.
*
* Based on -> https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication
*
* References:
*   - Vue Router (next) > Guide
*     https://next.router.vuejs.org/guide/
*/
import { assert } from '/@/assert'

import { createRouter, createWebHistory } from 'vue-router'

// Pages
//
// Note: Static import is shorter and recommended [1]. However, also the dynamic 'await import('./pages/Some.vue')'
//      should work.
//
//    [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
//
import Home from './pages/Home/index.vue'
import HomeGuest from './pages/Home.guest.vue'
import Project from './pages/Project.vue'
import NotFound from './pages/_NotFound.vue'

const LOCAL = import.meta.env.MODE === "dev_local";
  // For local mode, pass 'user=...' in navigation.

let localUser;    // 'user=' query parameter (LOCAL mode)     // <-- tbd. is that needed?  What for?

import { getCurrentUserProm, getCurrentUserWarm, setLocalUser } from './user'

// ALTERNATIVE to having components ask the current user from 'user' module.
//
function getCurrentUserId(r) {
  console.log("!!! Router asking current user", { r });

  if (LOCAL) {
    const uid = r.query.user;
    assert(uid, "No 'user' in query string to pass!");
    return uid;
  } else {
    const user = getCurrentUserWarm();
    assert(user?.uid, "No active user though locked route!");
    return user.uid;
  }
}

// #rework?
// "Try to keep the props function stateless, as it's only evaluated on route changes. Use a wrapper component if you
// need state to define the props, that way vue can react to state changes."
//
// ^--- = when do we hear of user changes?

/*
* Provide props for a component that relies on a logged in user.
*
*   - uid: uid of the current user
*   - ..: any parameters from the path (eg. project id as '/:id')
*/
function lockedProps(r) {   // (Route) => { uid?: string, ..params from path }

  const uid = getCurrentUserId(r);    // #rework If we keep this, bring the code here
  assert(uid,
    "[INTERNAL] Not finding user id in a locked path."    // route guards should have ensured a uid
  );

  return { uid, ...r.params }
}

const rLocked = (path, component, o) => ({ ...o, path, component, meta: { needAuth: true }, props: r => lockedProps(r) });
const rOpen = (path, component, o) => ({ ...o, path, component });

// Template note: You can use '.name' fields for giving routes memorizable names (separate from their URLs). Chose
//                not to do this, and go for the shorter format (best when there are lots of routes).
//
// Note: When coming here, the server has already tossed 200 to the client. If you wish proper 404 pages, do that at
//      the server config.
//
const routes = [
  // Home page allowed either signed in or not - will just render differently.
  //
  // Notes:
  //  - 'props: true' passes the 'route.params' (eg. '/:id') to the component, as props.
  //  - for query params, we also pass them as props so the component doesn't need to parse things (we do)
  //
  // Note: By using a '.name', we can distinguish between the guest home path and the signed one, without need for
  //    a designated URL for sign-in. :)
  //
  rLocked('/', Home, { props: r => ({ uid: getCurrentUserId(r) }) } ),
  LOCAL ? rOpen('/', HomeGuest, { name: 'Home.guest' })
        : rOpen('/', HomeGuest, { props: r => ({ final: r.query.final }), name: 'Home.guest' }),  // '[?final=/somein]'

  // #rework: those are the same
  LOCAL ? rLocked('/projects/:id', Project, { /*query: { user: localUser }*/ })    // '/projects/<project-id>[&user=...]'
        : rLocked('/projects/:id', Project, { }),    // '/projects/<project-id>'

  // Note: This covers HTML pages that the client doesn't know of. However, the status code has already been sent
  //    and it is 200 (not 404). Check server configuration for actual 404 handling.
  //
  rOpen('/:pathMatch(.*)', NotFound )    // was: ':catchAll(.*)'
].filter( x => x !== null );

const router = createRouter({
  history: createWebHistory(),
  //base: process.env.BASE_URL,    // tbd. what is this used for?
  routes
});

// See: Vue Router > Navigation Guards
//    -> https://next.router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
//
router.beforeResolve(async (to, from) => {
  assert(to.path !== null);   // "/some"

  console.log(`router entering page: ${to.path}`);

  /*** DISABLED: maybe we don't need 'to.matched' at all, Vue Router docs use 'to.meta'
  // 'to.matched' likely has the routes (including parent levels) leading to our page. We don't use route levels
  // (parent/children), so the array is always just one entry long. (Note: This is guesswork, '.matched' does not have
  // documentation in its source).
  //
  // Based on -> https://router.vuejs.org/guide/advanced/meta.html
  //
  console.debug("Before route, to.matched:", to.matched);    // DEBUG

  assert(to.matched.length == 1, "Multiple levels in 'to.matched' - we're unprepared!");
  const needAuth = to.matched[0].meta.needAuth;
  ***/
  const needAuth = to.meta.needAuth;

  // Vue Router (4.0.3) QUESTION:
  //
  // What is the relationship of the router with the components being created?
  //
  // We'd like to:
  //  - provide the uid of a signed-in user, to the component in question, as a prop, before entering it
  //
  // We already have this value, as a side-effect of checking authentication. Is there a nice way to pass it on to the
  // component itself?
  //
  // If yes, let's use it!
  // If not... need to have components ask for it when entered.

  if (LOCAL) {
    const uid = to.query.user || from.query.user;
    setLocalUser(uid);
    let ret;

    if (needAuth) {
      if (to.query.user) {    // already has self-claimed uid (ie. it's been through here)
        ret= true;
        // tbd. provide 'uid' also here!!

      } else if (from.query.user) {   // have the 'user=' in current URL; pass it on
        ret= {
          ...to,
          query: {...(to.query || {}), "user": from.query.user}
        };

      } else if (to.path === '/') {   // aiming at home; we can provide a guest version (same URL)
        ret= { name: 'Home.guest' };

      } else {   // no 'user=...'
        console.warn("Missing 'user' parameter");
        ret= { path: '/no-user-param' };
      }
    } else {    // Home.guest
      ret= true;   // just proceed
    }
    assert(ret !== undefined, "route missing");
    return ret;

  } else {  // real world
    let ret;

    if (needAuth) {
      // 'guest' is an undocumented way to force routing to go to 'Home.guest' (even when authenticated)

      const user = !(to.query.guest) && await getCurrentUserProm();    // null | { ..Firebase user object }

      if (user) {    // authenticated; pass 'uid' as a prop (since we already know it)
        // NOTE: This is alternative to asking the user from 'user' module, in the page.
        //     ALL pages that require authentication receive the 'uid' prop.
        console.debug("!!!", {to, props: to?.props});

        ret = true;
        //ret = {...to, params: { uid: user.uid }};     // we could do it with params, but won't

        /*ret= to?.props?.uid ? true : {...to,
          props: {...to?.props || {}, uid: user.uid}
        };*/

      } else if (to.path === '/') {   // okay to head to the root; we'll show sign-in
        ret= {
          name: 'Home.guest'
        };

      } else {  // need auth but user is not signed in
        console.log("Wanting to go to (but not signed in):", to);  // DEBUG

        ret= {
          name: 'Home.guest',
          query: {"final": to.fullPath}
        };
      }
    } else {    // Home.guest
      ret= true;   // just proceed
    }

    assert( ret !== undefined, "route missing");
    return ret;
  }
});

export {
  router
}
