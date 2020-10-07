/*
* /.eslintrc.cjs
*
* Only for the Rollup bootloader code in 'init/'. See application repo for linting the application code.
*
* References:
*   - Configuring ESLint
*     -> https://eslint.org/docs/user-guide/configuring
*
*   - List of available rules
*     -> https://eslint.org/docs/rules/
*/
const [off,warn,error] = ['off','warn','error'];

module.exports = {
  extends: ['eslint:recommended'],

  env: {
    browser: true,
    es6: true      // 'Promise'
  },

  parserOptions: {
    ecmaVersion: 2020,   // we use: object spread (2018), dynamic import (2020)
    sourceType: 'module'
  },

  rules: {
    "no-unused-vars": [warn, {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
    }],
    "no-constant-condition": [warn]
  }
}
