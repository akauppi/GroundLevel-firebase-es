# Developer notes

## Rollup vs. Vite

We'd like to be able to build with two options: plain Rollup and Vite (that uses Rollup underneath).

Unfortunately the Vite build is currently [not working](https://github.com/akauppi/GroundLevel-firebase-es/issues/35) 

>Edit: We got to Vite vs. Rollup size comparisons. Vite 488kB vs. Rollup 496kB (these likely are from different code bases, but there is no big sway one way or the other).
>
>One day, let's decide to have them both up - or toss one permanently aside?
