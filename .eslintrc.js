module.exports = {
  //extends: ['plugin:vue/recommended', 'jwalker'],   // as in jwalker's template
  extends: ['plugin:vue/recommended'],

  /* 'eslint-plugin-vue' is the base line. Here are deviations to it
  *
  * See -> https://vuejs.org/v2/style-guide/
  *
  */
  // Note: Compare these
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

    /*
    'no-console': 0,
    // 'vue/html-self-closing': 1,
    'vue/max-attributes-per-line': [2, {
      singleline: 3,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],

    // AK 30-Jan-20
    'max-len': [1, {    // 1: warning
      code: 100,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: true  // AK
    }],

    // AK 30-Jan-20
    'no-multi-spaces': [2,
      {
        ignoreEOLComments: true,    // AK
        exceptions: {
          VariableDeclarator: true,
          ImportDeclaration: true,
          AssignmentExpression: true,
        },
      },
    ]
    */

    'vue/valid-template-root': 0,   // doesn't apply to Vue 3
    //... add more above
  }
};
