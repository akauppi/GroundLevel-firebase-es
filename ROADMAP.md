# Roadmap 🗺

The author has some ideas on when the repo would be "done". 🙂

## Use of `Makefile`s

The current (Aug 2022) `package.json`s are burdened over their capabilities. The code is not very maintainable.

This will be eased by turning to the classic Gnu `make` tool, for dependency management and builds.

### Hide `npm` under Docker

Using `Makefile`s limits the role of `npm` to dependency fetching. 

It's not a big step to do that under Docker Compose, thus **not requiring a native `npm` to be installed at all**.

This can also pave way to using some more efficient Node package manager. Currently (Aug 2022), we use quite a lot of space in the (4-5) `node_modules` folders. 

---

The above changes would not greatly change the way the repo feels.


## Making `packages/{app|backend}` Git submodules

This is important, so people can use the repo on their own applications.

The idea is:

- all application specific code is in the submodules (separate repos from this, owned by you)
- very little "framework" stuff would remain copy-pasted in those submodules
   - ...and we can reduce that amount over time, even further

- you can pull in advances and version updates to the *framework* stuff (think Vite and Cypress versions and config)
   - ...while keeping your repos unaware of this!!!

Work happens in the clone that you have done of this repo, but the application side changes have their full, own version history (this is the magic of Git submodules).


## Interactive browser-to-browser comms 

There are many web apps that function as browser-to-browser real-time games. This is fascinating, and the demo app should showcase using such services.

- Picking suitable backend
- Showing how to set it up
- Client side use
- Graphics
- Gamepad from browser


<!-- shut lights
## Graphics

Interactive SVG Graphics.

The author loves this, and wants to do it with Svelte. Whether such work ends up being part of this repo, is another issue. Perhaps not - it may be best leveraged as web components.
-->


## Community

The author appreciates Discord.
