# Troubleshooting

## `gyp` error in `npm install` (macOS)

If you get `gyp: No Xcode or CLT version detected!` error:

```
# trash `/Library/Developer/CommandLineTools`
$ xcode-select --install
```

## `firebase` debug mode

```
$ firebase --debug emulators:start ...
```

If you encounter problems with the emulation (e.g. `Error: An unexpected error has occurred.`), add `--debug` to the command.

