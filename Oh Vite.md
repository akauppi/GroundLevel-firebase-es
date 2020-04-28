# Oh Vite!

[Vite](https://github.com/vuejs/vite) (GitHub) looks so beautiful I'd like to hug it!

---

..and then I realize I cannot have both Firebase and Vite serving the page..


Solution:

- take Firebase as any other dependency, via `npm`.

Note: Needs pulling in a single `firebase` (yuck!) instead of e.g. `@firebase/app`, `@firebase/auth`, `@firebase/firestore`.  Maybe it'll get modular, one day.

(loading from CDN always allows us modularity).

We could... Simply load from CDN.  :).   And provide the config locally.


