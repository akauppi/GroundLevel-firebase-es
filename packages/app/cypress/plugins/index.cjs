/*
* cypress/plugins/index.cjs
*
* We don't need this but Cypress insists in creating one. We could switch it off from the config but
* decided to keep as a template.
*
* This could be used for:
*   - reading config from a code file (.js) instead of .json (no big need)
*
* Note: The name needs to be '.cjs'. Cypress does not (as of 5.4.0) support ES module plugin files.
*     TypeScript would also be supported (likely with CJS module loading).
*
* See:
*   - Plugins (Cypress docs)
*     -> https://docs.cypress.io/guides/tooling/plugins-guide.html
*/
/// <reference types="cypress" />

// This is called when a project is opened or re-opened (e.g. due to the project's config changing).
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}
