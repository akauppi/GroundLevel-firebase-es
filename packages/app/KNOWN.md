# Known issues


## npm: "Cannot set property 'peer' of null"

Happens on Mac.

Seems to be due to the DC side changing the way `esbuild` is installed.

### What happens:

```
$ npm outdated
npm ERR! Cannot set property 'peer' of null

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/asko/.npm/_logs/2021-09-25T11_56_51_951Z-debug.log
```

### Cure

```
$ npm run _macNudgeEsbuild 
```

This worked, once.
