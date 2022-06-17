//
// cypress.config.js
//
import { defineConfig } from 'cypress'

export default defineConfig({
  screenshotsFolder: '.screenshots',
  video: false,
  fixturesFolder: false,    // did not need

  // See https://docs.cypress.io/guides/references/configuration#modifyObstructiveCode
  // Switched 'false' simply for hygiene: we're shipping modern code and there shouldn't be any antiquated tricks.
  //
  modifyObstructiveCode: false,

  e2e: {
    //setupNodeEvents(on, config) {},

    // For test-based development, we use a running 'npm run dev' (port 3000) instance.
    baseUrl: 'http://localhost:3000',

    //specPattern   // default: cypress/e2e/**/*.cy.{js,jsx,ts,tsx}
    //supportFile   // default: cypress/support/e2e.js

    // If tests take longer, the color they are reported in turns yellow (otherwise gray). (default: 10000)
    //
    slowTestThreshold: 1500
  }
})
