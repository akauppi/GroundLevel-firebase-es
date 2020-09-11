# Wishes for Vite


## Env values from config

Not sure if even intended. See -> [https://github.com/vitejs/vite/issues/417](https://github.com/vitejs/vite/issues/417)

We do this with a custom mode, but those are expected to be only "production" or "development", so swimming against the tool, there.

Or.. if we can set env directly from the command line (`--env x=y`) that would be tidiest.

The reason this is a problem for us is that there are *two* configurations for development: with or without the Firebase emulator.

I'd also like to be driving them simultaneously (so modifying files is not getting votes)....

**Sample case**

Provide the value of `GCLOUD_PROJECT` to the browser environment. 

This is set by `firebase emulator:exec` and we'd just want to carry it over. Current `.env` system doesn't seem to bend to this.

```
vite --env VITE_PROJECT=${GCLOUD_PROJECT}
```

This could set the `import.meta.env.VITE_PROJECT` value, within the browser. Would be SO happy! 🌞


## Configurable path to `index.html`

Vite keeps `index.html` at the project root.

For us, there's quite a lot of configuration files and `index.html` differs from them in being an actual product file. Thus.. it kind of gets lost.

We could:

- [ ] make `src` the project root, and import files relative.


### Why not as `public/index.html`?

This is where it should be, if `index.html` is seen as an immutable asset. For Vite, it's not that.

- In dev mode, Vite modifies it in-flight, making the scripts magic just work (this is great!)
- In production mode, Vite heavily modifies the file, bundling the scripts within it. This may be necessary with Vite's current (Jul '20) production strategy, but also a more immutable approach to index.html could be done.

See how we generate a `public/index.prod.html` and don't need its internal scripts to be massaged.


## Production "bundle" size comparison

You can build the code for production using either Rollup (with ES level bundling and some scripting in `tools/`) or Vite.

||Rollup|Vite 1.0.0-rc.4|comments|
|---|---|---|---|
|file size; minified (`du -hk -I "*.map"`)|728 kB|1484 kB|Rollup-built size is 49% of Vite's|

<!-- old stuff: remeasure!
|load time (local hosting)|270 ms|160 ms|not sure about variation|
|load time (web)|160, 275 ms|245, 295, 555 ms|
|file size; not minified (`du -hk -I "*.map"`)|1460 kB|1948 kB|-25%|

*Load time = time measured on page refresh, to the start of authentication flow, using Chrome developer tools.*
-->

Don't want to twist the blade for Vite, but merely provide a bar that can be reached with manual Rollup configuration. PRs to provide a more favourable comparison (i.e. tweaking the Rollup settings for Vite config) are welcome.

<!-- too mcuh
Since `index.html` now has become a read-only file for us, I'd still like to place it away from the root... Any ideas??
-->
