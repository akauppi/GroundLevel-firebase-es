/*
* src/main.js
*
* The entry point.
*/
import { createApp } from 'vue';

import App from './App.vue';
import router from './router.js';

// not quite yet
//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

createApp(App)
    .use(router)
    //.use(BootstrapVue)    // not quite yet
    //.use(IconsPlugin)
    .mount('#app');


/*** Note: with Vue 2.x we had this - what's a similar way with Vue 3 (beta)?
  renderError: (h, err) => {  // pour runtime problems on the screen, if we have them (may help in development);
                              // in production we may want to pour these to central monitoring
    return h('pre', { style: { color: 'red' }}, err.message)    // has 'err.stack'
*/
