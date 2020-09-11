# Wishes for Rollup

## BUG: Line numbers for `manualChunks` are wrong

```
AssertionError [ERR_ASSERTION]: false == true
    at manualChunks (/Users/asko/Git/GroundLevel-es6-firebase-web/rollup.config.prod.js:295:18)
```

There were "only" 171 lines in `rollup.config.prod.js`.

The reported line numbers are not pointing to the right line, if there is e.g. a failed `assert` or other problem in `manualChunks`, presented as a  function.

This is understandable, since Rollup config files have been, well, config files. But it would be good to report to Rollup.

Rollup 2.26.11

- [ ] Report to rollup, with a minimal reproducible sample (not this repo)

