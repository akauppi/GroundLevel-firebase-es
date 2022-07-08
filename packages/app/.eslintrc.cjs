/*
* .eslintrc.cjs
*
* References:
*   - Configuring ESLint
*     -> https://eslint.org/docs/user-guide/configuring
*/
const [off,warn,error] = ['off','warn','error'];

module.exports = {
  root: true,   // we want various source packages (app/backend/...) to remain independent
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],

  env: {
    browser: true,
    es6: true     // 'Promise'
  },

  globals: {
    central: true,

    // Values injected from 'vite.config.js'
    _LOCAL: true,
    _VERSION: true
  },

  parserOptions: {
    ecmaVersion: 2022,  // we use: top-level await (2022), dynamic import (2020)
    sourceType: 'module'
  },

  rules: {
    // eslint:recommended
    "no-unused-vars": [warn, {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
    }],
    //"no-constant-condition": [warn],

    // plugin:vue3-recommended

    // Allow comments in Vue component HTML
    'vue/comment-directive': off,

    // tbd. check 'npm lint' output and tune/clean these
    //    - use 'off'/'warn'/'error' as the values

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

    "no-constant-condition": [warn]
    //... add more above
  },

  overrides: [
    // general non-browser JS ('vite.config.js' etc.); not Node sources
    {
      files: ["*.js"],
      extends: ['eslint:recommended'],
      globals: {
        process: true,
      }
    },

    // run under node (ES modules sources)
    {
      files: ["local/*.js", "tools/*.js"],
      extends: ['plugin:node/recommended'],
      env: {
        node: true
      },
      rules: {
        "no-process-exit": off,
        "node/no-unpublished-bin": off,

        "node/no-unsupported-features/es-syntax": off   // top-level await, without warning
      }
    },

    // cjs build files (including this one)   // tbd. these deserve cleanup one day; this file is not for node, for example
    {
      files: ["*.cjs"],    // .eslintrc.cjs
      extends: ['plugin:node/recommended'],
      env: {
        node: true
      },
      globals: {
        module: true
      }
    }
  ]
};
