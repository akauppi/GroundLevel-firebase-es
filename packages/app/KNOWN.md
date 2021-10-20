# Known issues


## `npm outdated`: "Cannot set property 'peer' of null"

Happens on Mac, due to the `esbuild` package needing a re-install on the DC side.

### Steps

- `npm test` (from clean, so DC gets run)
- `npm outdated` (as any other npm command not wrapped for in `package.json`)

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

### Better cure?

We can try to map a separate folder (eg. `node_modules/esbuild.linux`) for the DC, copying the original contents there before launching DC.



## First `npm test` times out

```
$ npm test
...

 1) Sign In as Joe
       See one's name:
     AssertionError: Timed out retrying after 10000ms: Expected to find content: 'Joe D.' within the element: <div#user-name> but never did.
      at Context.eval (http://localhost:3000/__cypress/tests?p=cypress/joe/signInAs.spec.js:114:35)

```

This happens on the *first* test run (when DC containers are created). Reason is unknown - adding to the timeout did not help.

Docker Desktop for Mac 4.0.1

**Work-around:**

Run the tests a second time.

This does not hinder CI runs (which is fortunate).

