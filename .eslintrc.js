module.exports = {
  extends: ['plugin:vue/recommended', 'jwalker'],

  rules: {
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
      code: 80,
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
    ],

  }
};
