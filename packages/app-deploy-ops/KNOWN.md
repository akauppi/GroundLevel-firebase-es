# Known issues

## `npm build:vite` fails

```
$ npm run build:vite
...
RangeError: Maximum call stack size exceeded
    at getCssTagsForChunk (/Users/asko/Git/GroundLevel-es-firebase/packages/app-deploy-ops/node_modules/vite/dist/node/chunks/dep-e0f09032.js:23223:40)
    at /Users/asko/Git/GroundLevel-es-firebase/packages/app-deploy-ops/node_modules/vite/dist/node/chunks/dep-e0f09032.js:23228:38
    ...
```

It is not clear what causes this. Don't mind (unless you are the Vite author). We can use `npm run build:roll`.

