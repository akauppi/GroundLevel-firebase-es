# Known Issues

*Place for informing of things that are not seen as bugs.*


## `firebase use --clear` does not work

Reported as [https://github.com/firebase/firebase-tools/issues/2656](https://github.com/firebase/firebase-tools/issues/2656).

Work-around:

Add two aliases to your project, e.g. 

```
$ firebase use --add    # call it anything
...

$ firebase use --add    # call it "bandaid"
```

Also: check the above issue and +1 it, to get more focus...

**Since:**

- noticed and reported: `8.11.2` (30-Sep-20)

