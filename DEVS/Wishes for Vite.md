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

Vite insists that `index.html` be kept at the project root.

There are quite a lot of configuration files and `index.html` differs from them in being an actual product file. Thus.. it kind of gets lost.

We could:

- [ ] make `src` the project root, and import files relative.

Work-around:

- have the file as `public/index.html` (because that's where one would look)
- have a symbolic link as `index.html`, to please Vite

Why not allow a configuration entry???  This is likely a philosophical question, and the author is just not in the "Know".


### Why not as `public/index.html`?

This is where it should be, if `index.html` is seen as an immutable asset. For Vite, it's not that.

- In dev mode, Vite modifies it in-flight, making the scripts magic just work (this is great!)
- In production mode, Vite heavily modifies the file, bundling the scripts within it. This may be necessary with Vite's current (Jul '20) production strategy, but also a more immutable approach to index.html could be done.

See how we generate a `public/index.prod.html` and don't need its internal scripts to be massaged.


## Screen wipe is destructive (and `clearScreen: false` does not disable it)

[#clearScreen](https://vitejs.dev/config/#clearscreen) is supposed to "to prevent Vite from clearing the terminal screen when logging certain messages". 

That does not make clear what those "certain" messages are, but at least (2.0.0-beta.56) it does not affect the clearing before:

```
⚡Vite dev server running at:
```

With [Sirv](https://github.com/lukeed/sirv), in a similar situation, one can use the PgUp key to see the console lines before the clear. WITH VITE THIS IS NOT POSSIBLE - the lines flash and are FORGOTTEN!

Maybe Vite can implement the clear in the same way Sirv does?


