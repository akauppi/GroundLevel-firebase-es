# Wishes for Vite


## <strike>Env values from config</strike>

>This is now covered with [define](https://vitejs.dev/config/#define).


## Configurable path to `index.html`

>Vite now provides [root](https://vitejs.dev/config/#root) that we use to place all Vite files in their own `vitebox` folder. This works, and <strike>reduces</strike> removes the need to be able to move `index.html` around.

<strike>
Vite insists that `index.html` be kept at the project root.

There are quite a lot of configuration files and `index.html` differs from them in being an actual product file. Thus.. it kind of gets lost.
</strike>

<!-- continued (not relevant):
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
-->


## Screen wipe is destructive (and `clearScreen: false` does not disable it)

>Vite now has `--clearScreen=false` working from command line; for some reason it does not work from config file (likely bug; not worrying enough to report it!)

[#clearScreen](https://vitejs.dev/config/#clearscreen) is supposed to "to prevent Vite from clearing the terminal screen when logging certain messages". 

That does not make clear what those "certain" messages are, but at least (2.0.0-beta.56) it does not affect the clearing before:

```
⚡Vite dev server running at:
```

With [Sirv](https://github.com/lukeed/sirv), in a similar situation, one can use the PgUp key to see the console lines before the clear. WITH VITE THIS IS NOT POSSIBLE - the lines flash and are FORGOTTEN!

**Maybe Vite can implement the clear in the same way Sirv does?**

^-- The real wish is this last one. If clearing is what you want, you do want it the way Sirv does it (non-destructive).

