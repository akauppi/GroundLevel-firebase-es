# Wishes for Vite


## Configurable path to `index.html`

>Vite now provides [root](https://vitejs.dev/config/#root) that we use to place all Vite files in their own `vitebox` folder. This works, and <strike>reduces</strike> removes the need to be able to move `index.html` around.

<strike>
Vite insists that `index.html` be kept at the project root.

There are quite a lot of configuration files and `index.html` differs from them in being an actual product file. Thus.. it kind of gets lost.
</strike>

---

*Edit*:

This is now less of an issue, using `vitebox/` in development eliminates the confusion of having Vite `index.html` and configuration files in the same directory level. Consider it done?


<!-- clearScreen:false now seems to work?  Keep and remove.
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
-->
