# Problems


## Cannot find `package.json` of the root

```
Step #0: npm ERR! code ENOENT
Step #0: npm ERR! syscall open
Step #0: npm ERR! path /workspace/package.json
Step #0: npm ERR! errno -2
Step #0: npm ERR! enoent ENOENT: no such file or directory, open '/workspace/package.json'
Step #0: npm ERR! enoent This is related to npm not being able to find a file.
Step #0: npm ERR! enoent 
```

Did you miss the `..` at the end of:

```
$ gcloud builds submit --config=cloudbuild.master-pr.app.yaml ..
```
