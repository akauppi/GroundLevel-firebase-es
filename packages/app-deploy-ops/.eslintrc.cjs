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
    'eslint:recommended'
  ],

  env: {
    browser: true,
    es6: true     // 'Promise'
  },

  globals: {
    central: true
  },

  parserOptions: {
    ecmaVersion: 2020,  // we use: object spread (2018), dynamic import (2020)
    sourceType: 'module'
  },

  rules: {
    // eslint:recommended
    "no-unused-vars": [warn, {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
    }],
    //"no-constant-condition": [warn],

    "no-constant-condition": [warn]
    //... add more above
  },

  overrides: [
    {   // general non-browser JS ('vite.config.js' etc.); not Node sources
      files: ["*.js"],
      extends: ['eslint:recommended'],
      env: {
      },
      globals: {
      }
    },

    /***
    {   // run under node (ES modules sources)
      files: ["local/*.js"],
      extends: ['plugin:node/recommended'],
      env: {
        node: true
      },
      globals: {}
    },
    ***/

    // cjs build files (including this one)
    {
      files: ["*.cjs"],    // .eslintrc.cjs
      extends: ['eslint:recommended'],
      env: {
      },
      globals: {
        module: true
      }
    },

    {   // Browser code
      files: ["src/*.js"],
      env: {
        browser: true
      },
      globals: {
      }
    }
  ]
};
