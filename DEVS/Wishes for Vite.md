# Wishes for Vite


## Env values from config

Not sure if even intended. See -> [https://github.com/vitejs/vite/issues/417](https://github.com/vitejs/vite/issues/417)

We do this with a custom mode, but those are expected to be only "production" or "development", so swimming against the tool, there.

Or.. if we can set env directly from the command line (`--env x=y`) that would be tidiest.

The reason this is a problem for us is that there are *two* configurations for development: with or without the Firebase emulator.

I'd also like to be driving them simultaneously (so modifying files is not getting votes)....

---

Could try module aliasing.

**Sample case**

Provide the value of `GCLOUD_PROJECT` to the browser environment. 

This is set by `firebase emulator:exec` and we'd just want to carry it over. Current `.env` file system doesn't seem to bend to this.


## Configurable path to `index.html`

Vite keeps `index.html` at the project root.

For us, there's quite a lot of configuration files and `index.html` differs from them in being an actual product file. Thus.. it kind of gets lost.

We could:

- [ ] make `src` the project root, and import files relative.


### Why not as `public/index.html`?

This is where it should be, if `index.html` is seen as an immutable asset. For Vite, it's not that.

- In dev mode, Vite modifies it in-flight, making the scripts magic just work (this is great!)
- In production mode, Vite heavily modifies the file, bundling the scripts within it. This may be necessary with Vite's current (Jul '20) production strategy, but also a more immutable approach to index.html could be done.

See how we generate an `public/index.prod.html` and don't need its scripts to be massaged.

*Continuation...*

Now doing production build using ES modules, and Rollup. It is not true that this leads to long loading times.

<-- tbd. make a table of Vite production build vs. Rollup/ES6 load times. One day... -->

Since `index.html` now has become a read-only file for us, I'd still like to place it away from the root... Any ideas??
