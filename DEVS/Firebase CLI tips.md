# Firebase CLI tips

## Use the debug mode

```
$ firebase --debug emulators:start ...
```

If you encounter problems with the emulation ("Error: An unexpected error has occurred."), add `--debug` to the command.

Note: This is especially important in debugging CI.
