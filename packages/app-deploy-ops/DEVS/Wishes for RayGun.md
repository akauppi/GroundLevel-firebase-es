# Wishes for RayGun

## ESM native packaging

The `ray4js` (2.22.3) Node module comes with:

```
"main": "dist/raygun.umd.js",
```

>UMD is loadable to a browser as-such. Works for CDN; less so for Node builds.

In addition, the package has:

```
├── raygun.js
├── raygun.min.js
├── raygun.umd.js
├── raygun.umd.min.js
├── raygun.vanilla.js
├── raygun.vanilla.min.js
└── snippet
    ├── minified.fetchhandler.js
    ├── minified.js
    └── minified.nohandler.js
```    

|file|format|`window` globals|
|---|---|---|
|`raygun.js`||`TraceKit`, `raygunUtilityFactory`, `raygunNetworkTrackingFactory`, `raygunBreadcrumbsFactory`, `raygunCoreWebVitalFactory`|

We don't use JQuery, so can likely focus on the "vanilla" 🍨 flavor.


RayGun *could* add support for `exports` in their JavaScript releases, providing an ESM module version that:

- targets "evergreen" browsers only (no Internet Explorer)
- becomes the default import for ESM build chains
- expects modern ECMAScript (no polyfill tests)
- expects `fetch` API
- **BONUS:** provides TypeScript files

