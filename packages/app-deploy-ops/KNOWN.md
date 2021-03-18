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