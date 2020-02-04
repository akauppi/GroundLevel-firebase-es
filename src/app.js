/*--- Vue ---
*/
// Note: This works, but we might choose to load it in 'index.html' from CDN, then map Rollup to use that one with just 'vue'.
//
//  latest versions -> https://cdn.jsdelivr.net/npm/vue@2.6.11/ + menu top-right
//
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';  // works (CDN)

import App from './App.vue';

const app = new Vue({
  render: h => h(App)
});

export { app };
