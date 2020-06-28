/*
* References:
*   - Configuring ESLint
*     -> https://eslint.org/docs/user-guide/configuring
*/
module.exports = {
  extends: ['plugin:vue/vue3-recommended'],

  env: {
    "es6": true   // also sets 'parserOptions.ecmaVersion: "6"'
  },

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },

  // tbd. adjust the overrides. They likely are from Vue 2 era.
  rules: {
    // Allow comments in Vue component HTML
    'vue/comment-directive': 0,

    // see -> https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/mustache-interpolation-spacing.md
    //
    //'vue/mustache-interpolation-spacing': 0,
    //'vue/no-multi-spaces': 1,    // 0: off, 1: warn, 2: error

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
