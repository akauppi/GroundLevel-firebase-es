/*
* src/router.js
*
* Based on -> https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication
*/
import Vue from 'vue'
import VueRouter from 'vue-router'

// Pages
// note: not using lazy loading (didn't get it to work). #help
//
import pageHome from './pages/Home.vue';
import pageSignIn from './pages/SignIn.vue';
import pageSomeIn from './pages/SomeIn.vue';

import { userPromGen } from './auth.js';
import { assert } from './tools.js';

const routes = [
  {
    path: '/',
    naem: 'home',
    component: pageHome,      // note: this doesn't compile: >> component: () => import './pages/Home.vue', <<
    meta: {
      requiresAuth: true    // tbd. for many apps, it may be better to tag the pages _not_ needing auth
    }
  },
  {
    path: '/signin',    // '?final=/somein'
    name: 'signin',
    component: pageSignIn
  },
  {
    path: '/somein',
    name: 'somein',
    component: pageSomeIn,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  //base: process.env.BASE_URL,   // tbd. what to place instead?
  routes
});

router.beforeEach(async (to, from, next) => {
  assert(to.path !== null);   // "/someIn"

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !await userPromGen()) {   // waits the small while if authentication check still going on
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
