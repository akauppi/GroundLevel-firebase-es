# Getting Vue

The author was initially confused about where Vue.js should come from.

Samples load it via `index.html` but that puts dependency versions in two places.

Vue [documentation](https://vuejs.org/v2/guide/installation.html#NPM) mentions that:

>NPM is the recommended installation method when building large scale applications with Vue.

Large scale sounds good.[^1-fallacy]

[^1-fallacy]: Large Scale Fallacy. We often want to see our work being larger (in scope / size of data) than it actually is.

Then, I came across [Handling 3rd-party JavaScript with Rollup](https://engineering.mixmax.com/blog/rollup-externals/) (blog, Dec 2017):

>Starsky and Hutch[^2-names] aren't changing—until you upgrade their versions, that JS will remain exactly the same. But if you deploy Starsky as part of your bundle, the browser can't know that.

[^2-names]: Library names altered for anonymity.

Gotcha. 

I <u>want</u> my Vue to be in a separate file. I <u>may want</u> it to be coming from a CDN.

Let's prepare our template so that both of the good ways are easy to use. :)


## 1. From CDN

The Vue [instructions](https://vuejs.org/v2/guide/installation.html#CDN) suggest us to place this in the `index.html`:

```
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
</script>
```

This has two problems:

- we need to map `insert 'vue'` to `Vue` somewhere (doable)
- the `Vue` here is not global; the author doesn't know how to import directly to a global.

..but:

We can skip `index.html` and do the same CDN import within code (`src/app.js`):

```
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';  // works (CDN)
```

This works. 

<font color=red>tbd. How to take the URL to one place, let the bundle see it as just 'vue'?

Once `@rollup/plugin-alias` would work, let's do that!
</font>


## 2. From npm

Above way is good. CDN's are nice. But if you insist getting Vue via npm, this could work:

```
$ cd public
$ ln -s ../node_modules/vue/dist/vue.runtime.esm.js
```

You can then `import './vue.runtime.esm.js'` or alias that to `vue` <font color=red>(if alias works!)</font>, but the code won't get baked into your bundle but hosted separately.

>DISCLAIMER: Above hasn't been tested!  Please do. :)

