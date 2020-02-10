/*
* src/router/index.js
*
* Based on -> https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication
*/
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);     // tbd. what for?

const routes = [
  {
    path: '/',
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/SignIn.vue')    // tbd. gives linter error but same in 'Vue-guard-...-Authentication' example doesn't.
  },
  {
    path: '/somein',
    name: 'somein',
    component: () => import('../views/SomeIn.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !await firebase.getCurrentUser()) {
    next('signin');   // tbd. add '?redirect=<url>'
  } else {
    next();
  }
})

export default router
