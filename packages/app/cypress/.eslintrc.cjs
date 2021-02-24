/*
* cypress/.eslintrc.js
*
* Overrides for Cypress test linting (affects the IDE).
*
* References:
*   - Cypress ESLint Plugin (GitHub)
*     -> https://github.com/cypress-io/eslint-plugin-cypress
*/

module.exports = {
  extends: "plugin:cypress/recommended",
  plugins: ["cypress"],
  env: {
    "cypress/globals": true
  },
  globals: {
    describe: true
  },

  rules: {
    //"cypress/xxx": "warn"
  }
}
