# Known issues

## Ignore error tail in `npm test`

```
$ npm test
...
[dev] [emul] firebase emulators:start --project=test --only auth,functions,firestore exited with code 0
[dev] npm ERR! code ELIFECYCLE
[dev] npm ERR! errno 1
[dev] npm ERR! @app/app@0.0.0-unversioned dev:test: `concurrently --kill-others-on-fail -n emul,vite "firebase emulators:start --project=test --only auth,functions,firestore" "GCLOUD_PROJECT=test npm run _dev_test_vite"`
[dev] npm ERR! Exit status 1
[dev] npm ERR! 
[dev] npm ERR! Failed at the @app/app@0.0.0-unversioned dev:test script.
[dev] npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
[dev] 
[dev] npm ERR! A complete log of this run can be found in:
[dev] npm ERR!     /Users/asko/.npm/_logs/2020-10-30T10_29_12_149Z-debug.log
[dev] npm run dev:test exited with code 1
```

That npm error is unnecessary, and should be ignored. 

If you can mitigate this by tuning the commands, please contribute. `#help`

