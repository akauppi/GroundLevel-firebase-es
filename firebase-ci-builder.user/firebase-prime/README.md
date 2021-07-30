# firebase-prime

Tools to prime a Firestore emulated instance with:

- users
- data

## To-do

Sync the approach with `firebase-jest-testing` code. We don't want to use it (to avoid dependency on Jest
from the front end), but we can code in a similar (proven) fashion.

- Consider whether we should use `firebase-admin` for everything.

   Earlier, didn't want to do that since this was in a front-end project. Now, using it via Docker Composer that is no longer a valid consideration.
   
   
## References (more like Further Reading)

- [Node.js CLI Apps Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices) (GitHub, updated '21)

   Haven't really read those, but looks legitimate.
