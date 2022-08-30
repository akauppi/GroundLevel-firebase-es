# Firebase CLI tips

## Use the debug mode

```
$ firebase --debug emulators:start ...
```

If you encounter problems with the emulation ("Error: An unexpected error has occurred."), add `--debug` to the command.

Another way is to look at the `*-debug.log` files; `--debug` simply directs that information to the console.

Note: This is especially handy in debugging CI, because we don't get access to the `.log` files.
