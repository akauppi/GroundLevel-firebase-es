# Wishes for Vue.js 3

Dear Vue.

It's been nice to see you grow from Vue.js 2 to the blossoming that is Vue.js 3. You are doing many things right, so don't take this small feedback harshly.

It's just that.. being so beautiful, even a small annoyance stands out. Maybe you understand and something can be done about it. :)

Your fan. 🌺🌺

---

<!-- disabled (too lazy)
## Having better support for an async `reactive`

The [Vue Composition API](https://composition-api.vuejs.org/#ref-vs-reactive) says that one should use `reactive` by default, especially when the payload is object-like.

Case in question:

Object payload, but one that is not initially available. The Vue sample (tbd. link!) of a mouse pointer is one such - for us it's subscribing to the Firestore database.

This essentially makes the case one of "Promise of reactive", but we can forget about the promise since marking something as `undefined` would work just as well.

### Case `ref`

With a ref, we can (HTML template):

```
<div v-if="someref">   
  ...  if has a value
</div>
<div v-else>
  ...  if `undefined`
</div>    
```

A `ref` is said to suit such use case also because the type essentially is: `undefined` or object, instead of just object.

### Case `reactive`

For a reactive, the same is currently not valid - or meaningful:

```
<div v-if="somereactive">   
  ...  always comes here
</div>
<div v-else>
  ...
</div>    
```

`somereactive` evaluates to truish, since it represents an object.

Vue can change this (in some version). 

**Suggestion:**

The default `reactive()` without an explicitly given value would render to `undefined`, if used in the above way. The same would apply to a reactive provided as a `computed()`.

What problem does this fix?

This allows asynchronous use of a `reactive`, and provides better parity with `ref`. `reactive` would still only hold for cases where the payload is an object (or a `Map`), but this addition would cater for asynchronous initialization.

**Work-arounds:**

With Vue 3.0 betas, one can:

- use the emptiness of an object (or `Map`) as a token for not being initialized:

   ```
   object: v-if="Object.keys(somereactive).length > 0"
   Map:    v-if="somereactive.size > 0"
   ```
   
   This can be placed as a computed `ref` (of boolean), in which case we are almost in the target case, but with two reactive entries:
   
   ```
   <div v-id="somereactiveIsReady" 
   ```

- use a `ref`

   This is the advice from Discord users `jacek` and `blockhead` (Jul 11th 2020). The reasoning is that the type is `undefined`|`object`.
   
   It's a valid argument, with the current implementation.

**Backwards compatibility**

The change would not break existing, meaningful code. No application likely does a `v-if` on a reactive, because it would always evaluate to `true`, at the moment.

**Effects to documentation**

One would need to mention the behavior somewhere, in order for people to use it. It likely should be sold as "asynchronous use of `reactive`", since there's no use case for this, if the initial value of an object is already available.

As shown above, the use is similar to the default behavior of `ref` so conceptually this should be an easy sell. One or two lines in the docs should suffice.

```
**`reactive` with asynchronous initialization**

If you use the name of the `reactive` alone (without a dot or an index) in the HTML template, it renders to truish, if the `reactive` has been explicitly set to carry a value, and `undefined` if its in the state left by the default initializer: `reactive()`.

This can be used for rendering different content (e.g. a spinner), or hiding an element until there is a meaningful content.
```

**Implementation:**

The implementation would use some inner field like `_v_initialized` (there are similar, already), to differentiate between an uninitialized and an initialized `reactive`.

**Performance implications:**

Resetting the `_v_initialized` field per each write of the reactive (maybe there is a way to avoid this?).
-->


## Tapping to end-of-life of `reactive`

`Project/index.vue` does:

```
const [project, unsub] = projectSub(id);
```

This is within a `setup` block so the `project` will be ended, automatically, by Vue. 

**Current behaviour:**

There is no way, in JavaScript or Vue 3.0 beta, to detect that a `reactive` is going to be garbage collected.

**Suggested behaviour:**

A hook that allows the creator of a `reactive` to attach a function to be called, prior to garbage collecting the `reactive`. E.g.

```
const r = reactive(undefined, () => { ...stop a database subscription... });
```

>Note: It is not sure, whether such a function is always available at the time the `reactive` is created. But we can start with this - it's simpler than providing a `.onDelete( () => () )` that would be the more flexible solution.

**Problem this fixes:**

Makes application code simpler, and code more robust.

Makes libraries using `reactive` as their delivery method more plausible, since the interface remains simple.

**Problems this may create:**

If the `reactive` is created outside of the `setup` scope, there is no mechanism to stop subscribing.

Maybe there must be a `.stop()` method added to `reactive` for this reason, that would not need to be called when it's created within the `setup` scope?

**Work-arounds:**

Today (Jul 2020), there is no work-around that would allow the creator of the `reactive` to stop feeding it, once the data is no longer needed.

A garbage collection hook in the JavaScript engines would suffice, but is not available / not planned, as far as the author of the suggestion has found out.

**Would also `ref` need this?**

Not really. `reactive` is intended for object-like data and any streamed data that needs to be unsubscribed is likely to be object like. One can always derive `refs` from `reactive`, if need be.


<!-- Left out: this makes sense if we deal with "Promise of `reactive`" or "Promise of `ref`" but with the above take on `undefined`, we wouldn't need to. Therefore, this is not necessarily needed.

## `computed` with an async payload

There is [a plugin](https://github.com/foxbenjaminfox/vue-async-computed) for this for Vue.js 2.

Would be nice to have native support, so that this just works:

```
const members = computed(async () => {

  // fetches info about users, may take time
  return ...;
}	  
```

Current behavior (Vue 3.0 beta):

- the above code is not valid

Suggested behavior:

- The `members` reactive value should remain uninitialized (same as `ref(undefined)` or `reactive()`, until the Promise has resolved.
- After that, it would work as a usual `ref`/`reactive`.

**Problems solved:**

Provides a more natural story to using Vue with Promises.

**Current work-around:**

This can be done using `.watch`, and explicitly setting a `ref`/`reactive`:

```
const members = reactive();

...
```
-->


## An `async setup()`?

Vue implementation (3.0.0) requires the `setup` function to be synchronous.

There are likely reasons for this. However, could it be possible to allow `async` and then just wait for that Promise, until proceeding further?

This would simplify certain use cases, e.g. the access of Router in `AppProfile`.

