# Trouble(shooting)

## My tests fail!!

Seeing lots of RED?

```
● '/projects' rules › An author can add new authors, and remove authors as long as one remains

    expect.assertions(5)

    Expected five assertions to be called but received one assertion call.

      162 |     };
      163 | 
    > 164 |     expect.assertions(5);
          |            ^
      165 |     return Promise.all([
      166 |       expect( abc_projectsC.doc("1").update(p1_addAuthor) ).toAllow(),
      167 |       expect( abc_projectsC.doc("3-multiple-authors").update(p3_removeAuthor) ).toAllow(),

      at Object.<anonymous> (projectsC.test.js:164:12)
```

Try to restart the stand-alone emulator.

Update Firebase and re-install the emulator part.


