# Look Ma! No build step. 🧚‍♀️

[Snowpack](https://www.snowpack.dev/) brought in the liberating idea that front end builds - with ES modules - don't need to be developed with a build step. This simplifies things and is worth a try.

>Note: I tried this also *without* Snowpack, but it turned out `httpVueLoader` (which is needed for loading `.vue` files and compiling them into JavaScript in the browser) [needs Babel](https://github.com/FranckFreiburger/http-vue-loader/issues/89) for supporting ESM `import`s - and we’re not going there.

It seems, also [others have been considering this](https://github.com/vuejs/vue-dev-server) (exploratory repo by `vuejs`, Mar 2019), but they ended saying:

>*..this is a proof of concept and we won't work on anything in that direction for the immediate future as we have to concentrate on Vue 3.*

## Formulating the Question

I find that difficult.. There's a blog that states this to be easy (it uses `httpVueLoader` without ESM `import`/`export` in the Vue code.

- [ ] Track the landscape. If `httpVueLoader` starts a) being available as an ESM and b) supporting `.vue` code that uses ES modules, that would be our cue.





## Credits

- [Using Vue.js Single File Component Without Module Bundlers](https://medium.com/@jamesweee/using-vue-js-single-file-component-without-module-bundlers-aea58d892ad9) (blog, May 2019)