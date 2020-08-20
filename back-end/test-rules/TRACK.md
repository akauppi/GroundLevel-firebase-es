# Track

## firebase-js-sdk #2895

- [FR: Immutability when testing Firestore Security Rules](https://github.com/firebase/firebase-js-sdk/issues/2895) 
   - let's see what Firebase authors reply
		- no reply in 3 months #sniff 😢
   
## Jest: support for native ES modules

[https://github.com/facebook/jest/issues/9430](https://github.com/facebook/jest/issues/9430)

- Especially from [this](https://github.com/facebook/jest/issues/9430#issuecomment-653818834) onwards.

- `--experimental-vm-modules` needed, "So saying ESM is unflagged is a bit of a misnomer at the moment"

>Honestly though at this point it's not quite ready for prime time so if you are needing your project to work I might stick with Babel. (in the above ticket, 7-Jul-20)


<!-- hide: solved by adding `testEnvironment: 'node'` in Jest config.

## Jest: anomaly in handling `Uint8Array`

Well described [here](https://github.com/firebase/firebase-js-sdk/issues/3096#issuecomment-637176584) (Firebase Issues, 2-Jun-20): 

>The value object is an instance of Buffer, which is a subclass of Uint8Array; however, the value instanceof Uint8Array is mysteriously evaluating to false, causing the assertion failure.
>
>My hypothesis is that the Jest testing framework is doing something wonky with "realms", an advanced feature that allows for different global memory spaces for different parts of a JavaScript program. This has come up as an issue with Jest before, and there is a potential workaround: facebook/jest#7780.

**Workaround:**

[https://github.com/facebook/jest/issues/7780#issuecomment-615890410](https://github.com/facebook/jest/issues/7780#issuecomment-615890410)

**JEST issue:**

[https://github.com/facebook/jest/issues/7780](https://github.com/facebook/jest/issues/7780)

Once closed, try removing the workardound by:

- removing line about `__test-utils__` in `jest.config.cjs`
  - if still works, say farewell to `__test-utils__`

-->
