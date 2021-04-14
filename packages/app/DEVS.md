# Developer notes

## Peer problems when updating Vue

```
$ npm install
...
Found: @vue/compiler-sfc@3.0.5
npm ERR! node_modules/@vue/compiler-sfc
npm ERR!   peer @vue/compiler-sfc@"^3.0.4" from @vitejs/plugin-vue@1.1.4
npm ERR!   node_modules/@vitejs/plugin-vue
npm ERR!     dev @vitejs/plugin-vue@"^1.1.4" from the root project
npm ERR!   dev @vue/compiler-sfc@"^3.0.6" from the root project
...
```

If you run into such problems, remove the existing installation eg. by:

```
$ rm -rf node_modules/@vue node_modules/vue
```

Try again.


## Using `npm link`

If you co-create packages and use `npm link`, you need to relink after each `npm install`.

