# Known issues

## `npm run build:vite` fails

```
[vite]: Rollup failed to resolve import "/style.css" from "index.html".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
error during build:
```

These are solvable things. At some point, Rollup just sped past Vite build and is now the #1 (or: only) deployment build. 🐇


## `npm` vulnerabilities

Building raises two audit warnings:

|by|dependent package(s)|comments|
|---|---|---|
|`hosted-git-info`|via `concurrently@2.8.{8|9}`, a build time package|
|`path-parse@1.0.{6|7}`|`resolve@1.20.0` via multiple packages, all build time|

Both of these are from build-time tools, and "moderate" regex DoS warnings. Nothing to see; nothing to do about it?

<!--
tbd. how to filter build time dependencies out from audit?
-->
