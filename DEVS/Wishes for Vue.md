# Wishes for Vue.js 3 (beta)

Dear Vue.

It's been nice to see you grow from Vue.js 2 to the blossoming that is Vue.js 3. You are doing many things right, so don't take this small feedback harshly.

It's just that.. being so beautiful, even a small annoyance stands out. Maybe you understand and something can be done about it. :)

Your fan. 🌺🌺

---

## Having an async way to initiate `reactive` (and `ref`) so that it's never at an uninitialized value

If one tracks an async value, there should be a normal-feeling way to mark "we're still on it". This is normally the realm of Promises, but in this case that may be overkill (makes downstream code harder).

### `ref`

For a `ref`, one can already:

```
const r = ref();		// undefined
```

### `reactive`

For `reactive`, default value is `{}`, not `undefined`. The problem is that checking for an empty object is a bit clumsy in JavaScript, and one "needs to know" what's going on. `undefined` is the normal way to show something's not been initialized, yet.

```
const r = reactive.undefined();
```

This could create a normal `reactive`, except one that provides `undefined` as the value if it's not been initialized, yet.

**Current ways around**

The author doesn't know of a way to make `reactive` evaluate to anything but an object, or Map. This leaves:

- using the empty object `{}` meaning "undefined"
- using a special field `{ ready: false }` to show the value is not ready, yet

One can provide a Promise of a `reactive`. This could be ideal. Let's see how clumsy using such would be...

tbd.


## Tapping to end-of-life of `ref`/`reactive`?

`Project/index.vue` does:

```
    const [project, unsubProject] = projectSub(id);
```

This is within a `setup` block so the `project` will be ended, automatically. Can the creator of that `ref`/`reactive` somehow know when that happens?  

If so, it could unsubscribe from Firestore whereas now the upper level needs to explicitly ask it to do that (in `onBeforeUnmount`).


## `computed` with an async payload

There is [a plugin](https://github.com/foxbenjaminfox/vue-async-computed) for this for Vue.js 2.

Would be nice to have native support, so that this just works:

```
const members = computed(async () => {

  // fetches info about users, may take time
  return ...;
}	  
```

The `members` reactive value should change, once the Promise fulfills.

This can be done using `.watch`, but that feels slightly wrong.

