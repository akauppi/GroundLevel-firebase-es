module.exports = {
  extends: ['plugin:vue/vue3-recommended'],

  /* 'eslint-plugin-vue' is the base line. Here are deviations to it
  *
  * See -> https://vuejs.org/v2/style-guide/    <-- tbd. update to Vue 3
  */
  rules: {
    // see -> https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/mustache-interpolation-spacing.md
    //
    'vue/mustache-interpolation-spacing': 0,
    'vue/no-multi-spaces': 1,    // 0: off, 1: warn, 2: error

    // Without this, the toolchain doesn't pass HTML comments in '.vue' file's template section through. #sniff
    //'vue/comment-directive': 0,

    'vue/max-attributes-per-line': ['error', {
      'singleline': 99,  // AK
      'multiline': {
        'max': 1,
        'allowFirstLine': true    // AK
      }
    }],

    'vue/singleline-html-element-content-newline': 0, // AK (could also let it be enabled?)

    //... add more above
  }
};
