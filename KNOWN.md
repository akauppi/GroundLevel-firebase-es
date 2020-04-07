# Known Issues

## Warnings from Rollup plugins

When bringing in dependencies, you can spot:

```
$ npm install
...
npm WARN @rollup/plugin-node-resolve@7.1.1 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
npm WARN @rollup/plugin-alias@3.0.1 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
npm WARN rollup-plugin-livereload@1.1.0 requires a peer of rollup@^1.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @rollup/pluginutils@3.0.8 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
```

These plugins seem to work. Rollup 2 is rather new (March 2020) so it's expected new releases of these will soon make this disappear.

Rollup 2 seems to work as a plug-in replacement (from 1.31.1), so keeping it. 🙂