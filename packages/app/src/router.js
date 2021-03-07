/*
* src/router.js
*
* This file is maybe most Magic 🎩 in the whole project. It helps to know Vue Router and the concept of front end
* routing.
*
* References:
*   - Vue Router (next) > Guide
*     https://next.router.vuejs.org/guide/
*/
import { assert } from '/@tools/assert'

import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '/@firebase'

import { createRouter, createWebHistory } from 'vue-router'

//import { ref } from 'vue'

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

import { getCurrentUserWarm, isReadyProm } from './user'

// #rework?
// "Try to keep the props function stateless, as it's only evaluated on route changes. Use a wrapper component if you
// need state to define the props, that way vue can react to state changes."
//
// ^--- = when do we hear of user changes?

/*
* Asking the current user, when the auth pipeline may still be warming up.
*
* This isolates the authentication delays to the router, which can be asynchronous.
*/
async function getCurrentUserProm_online() {
  assert(!LOCAL);

  await isReadyProm;
  return getCurrentUserWarm();
}

/*
* Provide props for a component that relies on a logged in user.
*
*   - "uid": undefined | null | { ..Firebase user fields }
*   - ..: any parameters from the path (eg. project id as '/:id')
*/
function lockedProps(r) {   // (Route) => { uid: string, ..params from path }
  let uid;
  if (LOCAL) {
    uid = r.query.user;
  } else {
    uid = getCurrentUserWarm()?.uid;
  }
  assert(uid, _ => "[INTERNAL]: 'lockedProps' called without an active user");

  console.debug("'lockedProps' passing uid:", uid);    // DEBUG

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
  rLocked('/', Home ),

  LOCAL ? rOpen('/', HomeGuest, { name: 'Home.guest' })
        : rOpen('/', HomeGuest, { props: r => ({ final: r.query.final }), name: 'Home.guest' }),  // '[?final=/somein]'

  rLocked('/projects/:id', Project),   // '/projects/<project-id>[&user=...]'

  // For '/index.html', use the '/' route.
  // This removes 'index.html' from the URL which is fine. We merely want the user not to end up with 404.
  //
  { path: '/index.html', redirect: '/' },

  // Note: This covers HTML pages that the client doesn't know of. However, the status code has already been sent
  //    and it is 200 (not 404). Check server configuration for actual 404 handling.
  //
  rOpen('/:pathMatch(.*)', NotFound )    // was: ':catchAll(.*)'
]; //.filter( x => x !== null );

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

  // This used to be 'to.matched[0].meta.needAuth' but that's not needed: Vue router sums 'to.matched[].meta' for us.
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

    // Inform 'user.js'
    //REMOVE localUserRef.value = to.query.user || from.query.user;

    // Sign in in Firebase emulator. This
    //  a) ensures the user existed in 'local/users.js'
    //  b) provides the user details (displayName, photoURL) the normal route to the application (see 'user.js')
    //
    const uid = to.query.user || from.query.user;
    console.debug("Automatically signing in as:", uid);

    await signInWithCustomToken( auth, JSON.stringify({ uid }) )   // GETS STUCK!!
      .then( creds => {
        console.debug("Signed in as:", { creds });
      })
      .catch( err => {
        console.error("Sign-in failed:", err);
      })

    return ret;

  } else {  // real world
    let ret;

    if (needAuth) {
      // '__guest' is an undocumented way to force routing to go to 'Home.guest' (even when authenticated)

      const user = to.query.__guest ? null : await getCurrentUserProm_online();    // null | { ..Firebase user object }

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
  router,
  //localUserRef
}
