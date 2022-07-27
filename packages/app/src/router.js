/*
* src/router.js
*
* This file is maybe most Magic 🎩 in the whole project. It helps to know Vue Router and the concept of front end
* routing.
*
* References:
*   - Vue Router > Guide
*     https://router.vuejs.org/guide/
*/
import { assert } from '/@tools/assert'

import { signInWithCustomToken, getAuth } from '@firebase/auth'
const auth = getAuth();

import { createRouter, createWebHistory } from 'vue-router'

// Pages
//
import Home from './App/pages/Home/index.vue'
import HomeGuest from './App/pages/Home.guest.vue'
import Project from './App/pages/Project.vue'
import NotFound from './App/pages/_NotFound.vue'

const LOCAL = import.meta.env.MODE === "dev_local";

import { getCurrentUserId_sync, getCurrentUserId } from './user'

function fail(msg) { throw new Error(msg) }

// #rework?
// "Try to keep the props function stateless, as it's only evaluated on route changes. Use a wrapper component if you
// need state to define the props, that way vue can react to state changes."
//
// ^--- = when do we hear of user changes?

/*
* Provide props for a component that relies on a logged in user.
*
*   "uid":  undefined | null | { ..user fields }
*   ..:     any parameters from the path (eg. project id as '/:id')
*/
function lockedProps(r) {   // (Route) => { uid: string, ..params from path }
  let uid;
  if (LOCAL && r.query.user) {
    uid = r.query.user;   // 'dev:local' (not tests)
  } else {
    uid = getCurrentUserId_sync();
  }

  assert(uid, _ => "[INTERNAL]: 'lockedProps' called without an active user");

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
  // Home page allows either signed in or not - will just render differently.
  //
  // Notes:
  //  - 'props: true' passes the 'route.params' (eg. '/:id') to the component, as props.
  //  - for query params, we also pass them as props so the component doesn't need to parse things (we do)
  //
  // Note: By using a '.name', we can distinguish between the guest home path and the signed one. ALWAYS USE THE
  //    '{ name: ... }' in 'router.push'. Otherwise, rendering gets confused!
  //
  rLocked('/', Home, { name: 'Home' }),
  rOpen('/', HomeGuest, { name: 'Home.guest' }),

  rLocked('/projects/:id', Project),   // '/projects/<project-id>[&user=...]'

  // For '/index.html', use the '/' route.
  // This removes 'index.html' from the URL which is fine. We merely want the user not to end up with 404.
  //
  { path: '/index.html', redirect: '/' },

  // Note: This covers HTML pages that the client doesn't know of. However, the status code has already been sent
  //    and it is 200 (not 404). Check server configuration for actual 404 handling.
  //
  rOpen('/:pathMatch(.*)', NotFound )
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// See: Vue Router > Navigation Guards
//    -> https://router.vuejs.org/guide/advanced/navigation-guards.html
//
router.beforeResolve(async (to, _ /*from*/) => {
  const { path, meta, query, fullPath } = to;
  assert(path !== null);   // "/some"

  const needAuth = meta.needAuth;

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
      const currentUid = await getCurrentUserId();    // null | string
      const queryUser = query.user;   // '?user=...' in the URL

      if (currentUid && (!queryUser || queryUser === currentUid)) {   // already signed in; no abrupt change of user in the URL
        ret = true;   // proceed

      } else if (queryUser) {   // uid given by '&user=...'
        const uid = queryUser;
        //console.debug("Signing in as:", uid);

        // Sign in in Firebase emulator. This
        //  a) ensures the user existed in 'local/users.js'
        //  b) provides the user details (displayName, photoURL) the normal route to the application (see 'user.js')
        //  c) means we don't need to carry the query parameter to subpages
        //
        const creds = await signInWithCustomToken( auth, JSON.stringify({ uid }) )

        console.debug("Signed in as:", { creds });
        ret= true;

      } else {    // not signed in; no 'user=' in the URL
        if (path === '/') {   // aiming at home; we provide a guest version (same URL)
          ret= { name: 'Home.guest' };
        } else {
          console.warn("Missing 'user' parameter");
          ret= { path: '/no-user-param' };
        }
      }
    } else {    // guest pages
      ret= true;  // just proceed
    }

    (ret !== undefined) || fail("route missing");   // IDE note: if highlighted, just because there's no path that it'd be left "undefined". leave
    return ret;

  } else {  // real world
    let ret;

    if (needAuth) {
      // tbd. Do we need it?
      // '?__guest' is an undocumented way to force routing to go to 'Home.guest' (even when authenticated)
      const uid = /*query.__guest ? null :*/ await getCurrentUserId();    // null | string

      if (uid) {    // authenticated
        ret = true;

        // tbd. See if we can deliver the user as props
        /*ret= to?.props?.uid ? false : {...to,
          props: {...to?.props || {}, uid}
        };*/

      } else {  // need auth but user is not signed in
        console.log("Wanting to go to (but not signed in):", to);  // DEBUG

        ret = {
          name: 'Home.guest',
          ...( (fullPath && fullPath !== '/') ? { query: {"final": fullPath} } : {} )
        }
      }
    } else {    // any non-auth needing page (practically: 'Home.guest')
      ret= true;   // proceed
    }

    (ret !== undefined) || fail("route missing");
    return ret;
  }
});

export {
  router
}
