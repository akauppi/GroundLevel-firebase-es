# Coding style

## Prefer explicit exports over default

`import { some } from 'module.js'`, even when there's just one thing to export/import. Using default export (not those curly braces is treated as a javascriptism.

## Prefer `(vm) => ...` over `this`

ES6 arrow functions can be used with Vue. It's just that most existing samples rely on `this` approach. 

Using `this` becomes tedious in an otherwise ES6 environment. Which scope does it refer to - where was my `function`. Sometimes, there is no `function` keyword but it's implied:

```
const abc = ({
  ...,
  created() {   // method definition seems to make a traditional JavaScript function
    const vm = this;
```

It would be best to avoid using `this` completely, in ES6 code. Help is welcome to spot places it still exists - and overcome them with arrow functions.

## Language over framework

It seems Vue 2 has [injection handling](https://vuejs.org/v2/api/#provide-inject).

Instead of using that, we use ES6 modules (`mixins/user.js`).

The problem with framework features is added learning curve - also from the reader of such code. If something can be done in the language (ES6 + async/await), let's do it there.

This also makes it easier to change frameworks, or implement the template in multiple frameworks (in different branches).

