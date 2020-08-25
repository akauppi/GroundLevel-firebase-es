# Development tips

## Browser choice: Chrome rocks!

For the same error, Chrome (v80) gives way better console error messages than Safari (v13). It's simply faster to do basic development with Chrome.

Also, Chrome sports the "Vue.js devtools" plugin.

Safari:

![](.images/safari-console-error.png)

Chrome:

![](.images/chrome-console-error.png)

*(btw. that one was caused by forgetting `return { ... }` in declaring `data`. :/ )*


## Why (not to) have `package-lock.json`?

`package-lock.json` is intended to ensure that one's CI (or other developers) get the same dependencies as you. It makes debugging more reproducible.

It's also a pain, and in many cases unnecessary.

Reasons to have it:

- `npm audit` needs it.

If you want to run `npm audit`, do this:

```
$ rm .npmrc		# 'git restore' it later
$ npm install		# creates 'package-lock.json'
$ npm audit
```

To set back:

```
$ git restore .npmrc
$ rm package-lock.json
```

Of course, you can also choose to have it enabled. :)
