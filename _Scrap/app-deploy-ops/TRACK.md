# Track

## ECMAScript module support for web workers

- [https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)

   ![](.images/worker-esm-support.png)

The sheet says Firefox would need an IIFE build, but this is *not* according to our practical evidence. Firefox did not need the IIFE build.

- [ ] study more, later, with Firefox
- [ ] remove this entry if all-but-IE support ESM workers

## Firebase hosting emulator: not serving as HTTP/2

- [No HTTP/2 support in Firebase hosting emulator](https://github.com/firebase/superstatic/issues/277) (SuperStatic GitHub Issues)

HTTP/2 support is not really that important for emulation. Won't likely make it.

On the other hand, it would be nice to have the emulation *technically* as close to the real deployments, as possible. Not having HTTP/2 now makes a wedge between them.
