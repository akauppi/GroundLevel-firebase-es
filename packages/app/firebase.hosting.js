/*
* app/firebase.hosting.js
*
* The recipe for creating 'firebase.json' for deploying the front-end.
*
* Note: Development is done using Vite, not Firebase hosting emulation. This file does not affect development or tests.
*/

export default {
  hosting: {
    public: "dist",     // must match the output dir in 'vite.config.js'

    /* Non-existing '.html' and postfix-less fetches should lead to SPA index. Missing sourcemaps, scripts etc. should
    * show as 404.
    *
    * Test this (manually, once deployed) by:
    *   /style.css   -> 200; Content-type: text/css
    *   /nosuch.js   -> 404
    *   /some        -> 200 (index.html)
    *   /some.html   -> 200 (index.html)
    *   /main-{hash}.js (that exists) -> 200; Content-type: application/javascript
    *   /main-{hash}.js.map (that exists) -> 200; Content-type: application/json
    */
    rewrites: [
      {
        source: "!**/*.@(css|js|map)",
        destination: "/index.html"
      }
    ],

    /*
    * If you change the app's routing, consider adding a redirect so that users' existing bookmarks and what-not
    * can remain functional, despite the change (if it's just a rework).
    */
    redirects: [
      {
        source: "/old-sample",
        destination: "/new-sample",
        type: 301
      }
    ],

    /*
    * Google recommends "one week and preferably up to one year for static assets" cache times.
    *   - Firebase Hosting defaults to 1h.
    *   - LightHouse mentions about the 1h and suggests to raise it.
    *
    * Note: Keep 'index.html' at the default (1h). This is likely good for the CDN (so not every fetch leads all the
    *       way to the Firebase Hosting).
    *
    * See -> https://stackoverflow.com/questions/40375694/how-to-leverage-browser-caching-in-firebase-hosting"
    */
    headers: [
      {
        source: "**/*.@(js|map)",
        headers : [ { "key" : "Cache-Control", "value" : "max-age=604800" } ]
      }, {
        source: "**/*.@(jpg|jpeg|gif|png)",
        headers : [ { "key" : "Cache-Control", "value" : "max-age=604800" } ]
      }
    ]
  }
}
