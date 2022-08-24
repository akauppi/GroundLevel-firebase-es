# Coding style

## Prefer explicit exports over default

`import { some } from 'module.js'`, even when there's just one thing to export/import. 

Using default export (no curly braces) is treated as an anti-pattern. It's against consistency of code and also defeats the purpose of tree-shaking.


## Avoid `this` - like a plague

`this` is *not* required with ES6 coding and Vue.js 3.

Any place where it occurs is **treated as a bug**.

*Why does this matter?*

The `this` mentality provides an additional axis of abstraction (a context) that is sometimes hard to reason about (`function` vs. arrow function). It makes the *language* more complex than it needs to be.

## Language over framework

If there are overlapping features with the language (a larger context) and a framework or library (smaller context), prefer the language.

>*This would need to have a sample...*

The problem with framework features is added learning curve - also from the reader of such code. If something can be done in the language (ES6 + async/await), let's do it there.

This also makes it easier to change frameworks, or implement the template in multiple frameworks.

