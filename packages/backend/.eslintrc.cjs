/*
* /back-end/.eslintrc.cjs
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
    node: true,
    es6: true     // 'Promise'
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

    "no-constant-condition": [warn]
    //... add more above
  },

  overrides: [
    // cjs build files (including this one)
    {
      files: ["*.cjs"],    // .eslintrc.cjs
      env: {
        node: true
      },
      globals: {
        module: true
      }
    }
  ]
};
