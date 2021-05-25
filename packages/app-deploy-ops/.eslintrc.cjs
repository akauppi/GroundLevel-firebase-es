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

  // Defaults for browser sources
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
    {   // Config files; not Node sources
      files: ["./*.js", "vite/**.js", "roll/**.js", "vite-and-roll/**.js"],
      extends: ['eslint:recommended'],
      env: {
      },
      globals: {
        process: true
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
    }
  ]
};
