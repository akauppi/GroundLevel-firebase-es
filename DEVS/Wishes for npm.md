# Wishes for `npm`

*Don't take these seriously. The author sees the future of the repo being such that `Makefile`s and Docker run the show. The developer doesn't even need to have `npm` (or other package managers) installed. This gives us the freedom to change the package manager (to `pnpm`, `yarn` or something really modern, like Bun?) because it's become an implementation detail.*

*Thus, we shouldn't worry about what `npm` offers or doesn't.*


## Workspaces

>This repo started work without workspaces. The subrepos linked to each other using `file:` like this (from `app-deploy-ops/package.json`):
>
>```
>  "dependencies": {
    "@local/app": "file:../app",
    "firebase": "^0.900.19"
  },
```
>
>This works.
>
>It has some down sides, for which the author hoped `npm` 7 support for "workspaces" would help:
>
>- multiple `node_modules`. We get 3 different downloads of `firebase` when one could suffice.
>- no respect for `files` and `exports`. The `app/package.json` declares its publicly available footprint as:
>
>   ```
>   "files": [
       "vitebox/dist/*"
    ],
    "exports": {
       ".": "./vitebox/dist/app.es.js"
    },
    ```
>	 This means: Only expose files in `vitebox/dist/` folder. Only expose one module, which is.. .

`npm` with `file:` dependency does not respect the `files` and `exports` fields. One sees *all* of `packages/app/*` under `packages/app-deploy-ops/node_modules/@local/app`. It could only have `vitebox/dist`.

```
$ cd packages/app-deploy-ops
$ npm install
$ ls node_modules/@local/app
APPROACH.md		DEVS.md			LICENSE.md		README.md		TRACK.md		cypress.json		firestore-debug.log	package.json		tools			vite.config.js
CHANGELOG.md		KNOWN.md		README.2-tests.md	ROUTES.md		cypress			firebase.json		local			src			ui-debug.log		vitebox
```

We could have just `vitebox` there, right?

This is due to how the `file:` dependency is handled.

Workspace could be smarter, right?  But it's not.

```
# npm 7.7.5, project root
$ npm install
$ ls node_modules/@local/app
$ ls node_modules/@local/app
APPROACH.md		DEVS.md			LICENSE.md		README.md		TRACK.md		cypress.json		firestore-debug.log	package.json		tools			vite.config.js
CHANGELOG.md		KNOWN.md		README.2-tests.md	ROUTES.md		cypress			firebase.json		local			src			ui-debug.log		vitebox
```

Same thing.

This matters, because it throws away a chance for really nice encapsulation. The current implementation allows packages to reach for each other's files that *were not intended to be available* - and that would not be available, if properly published.

I don't know why `npm` does it like this, but it's a missed opportunity.

