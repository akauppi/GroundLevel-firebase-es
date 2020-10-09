# Coding style

## Prefer explicit exports over default

`import { some } from 'module.js'`, even when there's just one thing to export/import. Using default export (no curly braces) is treated as a javascriptism.

## Avoid `this` - like a plague

`this` is *not* required with ES6 coding and Vue.js 3.

Any place where it occurs is **treated as a bug**.

*Why does this matter?*

The `this` mentality provides an additional axis of abstraction (a context) that is sometimes hard to reason about (`function` vs. arrow function). It makes the *language* more complex than it needs to be.

## Language over framework

The sample for this is from Vue 2 but may serve a point:

---

It seems Vue 2 has [injection handling](https://vuejs.org/v2/api/#provide-inject). 

Instead of using that, we use ES6 modules (`mixins/user.js`).

---

The problem with framework features is added learning curve - also from the reader of such code. If something can be done in the language (ES6 + async/await), let's do it there.

This also makes it easier to change frameworks, or implement the template in multiple frameworks.
