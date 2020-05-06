/*
* src/router.js
*
* Based on -> https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication
*/

// ⛑ needed for Vite 0.7.0 .. 0.10.2+?
import { createRouter, createWebHistory } from 'vue-router/dist/vue-router.esm.js';   // map from 'vue-router' once Vite has it (this is only in one place, so no big deal)

// Gives 'process is not defined' (tries to load 'vue-router.esm-bundler.js')
//import { createRouter, createWebHistory } from 'vue-router';

// Pages
//
// Note: Static import is shorter and recommended [1]. However, also the dynamic 'await import('./pages/Some.vue')'
//      should work. ESLint dislikes it, though. (May 2020)
//
//    [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
//
import pageHome from './pages/Home.vue';
import pageSignIn from './pages/SignIn.vue';
import Project from './pages/Project.vue';
import page404 from './pages/404.vue';

import { currentFirebaseUserProm } from './util/auth.js';
import { assert } from './util/assert.js';

const r = (path, component, o) => ({ ...o, path, component });
const skipAuth = (path, component, o) => ({ ...o, path, component, meta: { skipAuth: true } })

// Template note: You can use '.name' fields for giving routes memorizable names (separate from their URLs). Chose
//                not to do this, and go for the shorter format (best when there are lots of routes).
//
const routes = [
  r('/', pageHome, { name: 'home' }),
  skipAuth('/signin',  pageSignIn),    // '?final=/somein'
  r('/projects/:id', Project, { props: true, name: 'projects' }),    // '/projects/<project-id>'
    //
  r('/dynamic', () => import('./pages/Home.vue')),    // Q: why ESLint colors it red? #help
    //
  skipAuth('/:catchAll(.*)', page404 )
];

const router = createRouter({
  history: createWebHistory(),

  //base: ...,    // tbd. what is this used for?  What to place here?
  routes
});

router.beforeEach(async (to, from, next) => {
  assert(to.path !== null);   // "/some"

  console.log(`router entering page: ${to.path}`);

  // tbd. Describe exactly what the 'to.matched.some(record => ...);' does.
  //    Some samples also have simpler: ...(paste here when coming across it)...
  //
  // Based on -> https://router.vuejs.org/guide/advanced/meta.html
  //
  const skipAuth = to.matched.some(record => record.meta.skipAuth);

  if (skipAuth || await currentFirebaseUserProm() !== null) {
    next();   // just proceed

  } else {    // need auth but user is not signed in
    console.log("Wanting to go to (but not signed in): ", to);  // DEBUG

    if (to.path === '/') {
      next('/signin')   // no need to clutter the URL
    } else {
      next(`/signin?final=${to.path}`);
    }
  }
});

export default router
