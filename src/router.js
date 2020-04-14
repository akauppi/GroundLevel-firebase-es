/*
* src/router.js
*
* Based on -> https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication
*/
import VueRouter from 'vue-router'

// Pages
// note: not using lazy loading (didn't get it to work). #help
//      Track -> https://github.com/vuejs/rollup-plugin-vue/issues/328
//
import pageHome from './pages/Home.vue';
import pageSignIn from './pages/SignIn.vue';
import page404 from './pages/404.vue';

import { currentFirebaseUserProm } from '@/util/auth.js';
import { assert } from '@/util/assert.js';

const reqAuth = { requiresAuth: true }

// Template note: You can use '.name' fields for giving routes memorizable names (separate from their URLs). Chose not to do
//    this, and go for the shorter format (best when there are lots of routes).
//
const routes = [
  { path: '/',        component: pageHome, meta: reqAuth },
  { path: '/signin',  component: pageSignIn },    // '?final=/somein'
  //{ path: '/projects',  component: pageProject },    // '/projects/<project-id>'
    //
  { path: '*', component: page404 } //,

  //{ path: '/ignore', component: () => import './pages/Home.vue' }   // tbd. Why doesn't this compile?
];

const router = new VueRouter({
  mode: 'history',
  //base: ...,    // tbd. what is this used for?  What to place here?
  routes
});

router.beforeEach(async (to, from, next) => {
  assert(to.path !== null);   // "/some"

  console.log(`router entering page: ${to.path}`);

  // tbd. Describe exactly what the 'to.matched.some(record => record.meta.requiresAuth);' does.
  //    Some samples also have simpler: ...(paste here when coming across it)...
  //
  // Based on -> https://router.vuejs.org/guide/advanced/meta.html
  //
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && ! await currentFirebaseUserProm().then( user => user !== null )) {
    // user is signed in (we ignored its value from the Promise)
    console.log("Wanting to go to (but not signed in): ", to);  // DEBUG

    if (to.path === '/') {
      next('/signin')   // no need to clutter the URL
    } else {
      next(`/signin?final=${to.path}`);
    }
  } else {
    next();   // just proceed
  }
});

export default router
