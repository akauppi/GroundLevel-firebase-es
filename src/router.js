/*
* src/router.js
*
* Based on -> https://github.com/gautemo/Vue-guard-routes-with-Firebase-Authentication
*/
import Vue from 'vue'
import VueRouter from 'vue-router'

// "This has to be done before you start your app by calling new Vue()."
Vue.use(VueRouter);

// Pages
// note: not using lazy loading (didn't get it to work). #help
//
import pageSignIn from './pages/SignIn.vue';
import pageSomeIn from './pages/SomeIn.vue';

const routes = [
  {
    path: '/',
    redirect: '/signin'
  },
  {
    path: '/signin',
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !await firebase.getCurrentUser()) {
    next('signin');   // tbd. add '?redirect=<url>'
  } else {
    next();
  }
});

export default router
