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

import { user } from './auth.js';
import { assert } from './tools.js';

const routes = [
  {
    path: '/',
    naem: 'home',
    component: pageHome,
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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !user.isSignedIn) {
    console.log("Wanting to go to (but not signed in): ", to);  // DEBUG

    assert(to.path !== null);   // "/someIn"

    if (to.path === '/') {
      next('/signin')   // no need to clutter the URL
    } else {
      next(`/signin?final=${to.path}`);
    }
  } else {
    next();
  }
});

export default router
