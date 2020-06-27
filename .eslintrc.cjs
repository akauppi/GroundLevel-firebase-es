module.exports = {
  extends: ['plugin:vue/vue3-recommended'],

  // tbd. Not sure what settings and package.json contents to have. This happens:
  //  <<
  //    $ npm run build
  //    ...
  //      /Users/asko/Git/GroundLevel-es6-firebase-web/src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang.css
  //        25:3  error  Parsing error: Unexpected character '#'
  //  <<
  //
  /*parserOptions: {
    sourceType: "module",
    //ecmaVersion: 2018,
  },*/

  rules: {
    // see -> https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/mustache-interpolation-spacing.md
    //
    //'vue/mustache-interpolation-spacing': 0,
    //'vue/no-multi-spaces': 1,    // 0: off, 1: warn, 2: error

    // Allow comments in Vue component HTML (0: quiet)
    'vue/comment-directive': 0,

    /*'vue/max-attributes-per-line': ['error', {
      'singleline': 99,  // AK
      'multiline': {
        'max': 1,
        'allowFirstLine': true    // AK
      }
    }],*/

    //'vue/singleline-html-element-content-newline': 0, // (could also let it be enabled?)

    //... add more above
  }
};
