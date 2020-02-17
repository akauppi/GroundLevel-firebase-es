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

