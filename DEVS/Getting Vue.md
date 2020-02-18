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

These goals can be reached using either `index.html` or import mapping straight to CDN URLs. As a third option, you could link the `npm` files as symbolic links from the `public` folder, thus keeping them outside of the bundle. Let's study the two first options. They both utilize CDN.


## 1. Via `index.html`

The Vue [instructions](https://vuejs.org/v2/guide/installation.html#CDN) suggest us to place this in the `index.html`:

```
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
</script>
```

This has two problems:

- we need to map `insert 'vue'` to `Vue` somewhere (doable)
- the `Vue` here is not global; the author doesn't know how to import directly to a global.

One could circumvent these with a little bit of coding in `index.html`, but let's look at the other option. 


## 2. Via Rollup `output.paths`

We add the following config in `rollup.config.js`:

```
output: {
   ...   
   paths: {
      vue: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js',
      "vue-router": 'https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.esm.browser.js'
   }
} 
```

This allows you to use `import Vue from 'vue'` anywhere in the code (makes access explicit), yet directs the request to a certain URL in a centralized place.

