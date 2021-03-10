# Known issues

## Duplicates of `tslib`

```
vite/out/app/tslib.a8b6125c.js                3.47kb / brotli: 1.40kb
vite/out/app/tslib.a8b6125c.js.map            9.27kb
vite/out/ops/tslib.f30a2d7e.js                3.52kb / brotli: 1.42kb
vite/out/ops/tslib.f30a2d7e.js.map            14.05kb
```

Due to the way we pull Firebase both in the app, and here, two `tslib` packages arise.

A simple `resolve.dedupe` didn't solve it, so leaving for now. A good thing to look at, when the construction dust has settled.

