# Wishes for Vue.js 3 (beta)

Dear Vue.

It's been nice to see you grow from Vue.js 2 to the blossoming that is Vue.js 3. You are doing many things right, so don't take this small feedback harshly.

It's just that.. being so beautiful, even a small annoyance stands out. Maybe you understand and something can be done about it. :)

Your fan. 🌺🌺

---

## Having an async way to initiate 'reactive' (and 'ref') so that it's never at an uninitialized value

If one tracks an async value, there are no meaningful initial values until the first values arrive.

However, the `reactive`/`ref` coding seems to demand that we place some initial value. Ideally:

- one could initialize `reactive`/`ref` without a value
- reading such would wait until a value is provided

This would turn every `.value` and get into a Promise operation. Maybe that's not appropriate. 

In that case, a helper for easy creation of an explicit Promise could do the job:

```
const prom = await reactive().setOnce();    // promise succeeds when the value is first time set
```

Maybe people knowing Vue.js 3 deeper can come up with better solutions?


## Tapping to end-of-life of `ref`/`reactive`?

`Project/index.vue` does:

```
    const [project, unsubProject] = projectSub(id);
```

This is within a `setup` block so the `project` will be ended, automatically. Can the creator of that `ref`/`reactive` somehow know when that happens?  

If so, it could unsubscribe from Firestore whereas now the upper level needs to explicitly ask it to do that (in `onBeforeUnmount`).




