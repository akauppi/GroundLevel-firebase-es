/*
* /.eslintrc.cjs
*
* Only for configuration files (like this). See 'packages/**_/.eslintrc.cjs' for linting the actual code (they are
* marked 'root: true' so isolated from this file).
*
* References:
*   - Configuring ESLint
*     -> https://eslint.org/docs/user-guide/configuring
*/
const [off,warn,error] = ['off','warn','error'];

module.exports = {
  root: true,
  extends: ['eslint:recommended'],

  env: {
    node: true,
    es6: true      // 'Promise'
  },

  globals: {
    //module: true,
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
