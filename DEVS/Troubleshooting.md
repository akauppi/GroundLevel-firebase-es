# Troubleshooting

## `gyp` error in `npm install` (macOS)

If you get `gyp: No Xcode or CLT version detected!` error:

```
# trash `/Library/Developer/CommandLineTools`
$ xcode-select --install
```

