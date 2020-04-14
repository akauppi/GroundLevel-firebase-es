# Known Issues

## Warnings from Rollup plugins

When bringing in dependencies, you can spot:

```
$ npm install
...
npm WARN @rollup/plugin-replace@2.3.1 requires a peer of rollup@^1.20.0 but none is installed. You must install peer dependencies yourself.
```

Just ignore. The warning will seize once authors update `@rollup/plugin-replace` (other already did).

Rollup 2 seems to work as a plug-in replacement (from 1.31.1), so keeping it. 🙂