# Known Issues

## First `npm test` fails

Not sure why this happens. `#help`

Work-around: just run `npm test` a second time.

```
$ npm test

> pretest
> npm run -s _prepFunctions


> test
> if port-is-taken --silent 4000 ; then npm run _test1; else docker compose run test ; fi

[+] Running 1/1
 ⠿ Container backend_emul_1  Recreated                                                                                                                                                                                                     0.3s
[+] Running 1/1
 ⠿ Container backend_emul_1  Started                                                                                                                                                                                                       1.7s
wait-for-it: waiting 20 seconds for emul:4000
wait-for-it: emul:4000 is available after 16 seconds
node:internal/modules/cjs/loader:930
  throw err;
  ^

Error: Cannot find module '/proj/packages/app/hack/ack-await.js'
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:927:15)
    at Function.Module._load (node:internal/modules/cjs/loader:772:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:79:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}
```