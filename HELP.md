# Help!

## Vue.observable usage for projects 

Someone with good understanding of Vue reactivity could have a look at  `src/mixins/myProjects.js` and `src/data/projects.js` and see, if better patterns are available.

We are trying to reach a pattern, where projects, and their inner data, fall effortlessly from Firebase to Vue.js application level, as observables or computed fields. 

<font color=red>The current code looks clumsy. If it even works. :P</font>

Vue.js 3 likely makes this simpler. 

<!-- #whisper
Could ask @Linus_Borg to have a look. He mentioned liking to crawl other people's code...?
-->


## Why doesn't dynamic `import` compile/work?

>![](.images/dynamic-import.png)

Why does `import` get the red note from ESLint?

We should be able to use the dynamic `import` feature of modern browsers.

See e.g. [Build A Lazy-Load Router With Vue.js And The Latest Browser Features](https://medium.com/js-dojo/build-a-lazy-load-router-with-vue-js-and-the-latest-browser-features-a1b52fe52dda) (blog, Dec 2017)

