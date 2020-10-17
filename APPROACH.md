# Approach

## One `local` or two?

Both the Cypress tests (`npm test`) and `npm run dev` want to have local data - and users - for the emulation. They can work completely offline.

You can separate these, but there's not necessarily benefits from it. Since the data is tied to users (because of Firestore access rights), we can simply keep one folder - `local` - having both. Anything having to do with the Daltons is for testing - changing those will affect tests passing.

Anything else is for your development pleasure, and free to be changed at will.

You can of course combine these approaches even more, and sign in as one of the Daltons, also under `npm run dev`.

