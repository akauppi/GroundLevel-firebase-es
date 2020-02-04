# Qs

## What about IE11 support?

It doesn't support ES6 modules. If you need IE11 support, it's fairly easily doable.

- Check out [@rollup/plugin-buble](https://github.com/rollup/plugins/tree/master/packages/buble) and take it to use
- Change the Rollup output format from `esm` to e.g. `iife`

You may need to experiment. Once done - and if you wish to maintain the work - it could be incorperated as an `ie11` branch.

The reason this is not default is just avoiding any complexity. The template aims to be slender and smooth.
