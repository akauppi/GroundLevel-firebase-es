//
// cypress.config.js
//
import { defineConfig } from 'cypress'
import { getIncoming } from './cypress/getIncoming.js'

// Cypress > Configuration
//  -> https://docs.cypress.io/guides/references/configuration#Configuration-File
//
// NOTE: IF YOU MAKE CHANGES TO THE CONFIG, Cypress MUST BE RESTARTED.
//
export default defineConfig({
  screenshotsFolder: '.screenshots',
  video: false,
  fixturesFolder: false,    // did not need

  // See https://docs.cypress.io/guides/references/configuration#modifyObstructiveCode
  // Switched 'false' simply for hygiene: we're shipping modern code and there shouldn't be any antiquated tricks.
  //
  modifyObstructiveCode: false,

  e2e: {
    // Desktop Cypress: run against 'npm run dev' instance
    // 'make test' Cypress: this gets overridden (
    baseUrl: 'http://localhost:3000',

    //specPattern   // default: cypress/e2e/**/*.cy.{js,jsx,ts,tsx}
    //supportFile   // default: cypress/support/e2e.js

    // Set up Cypress plugins (enables admin/OS level tasks)
    //
    setupNodeEvents(on, config) {
      const { taskTimeout } = config;
      taskTimeout || fail("No 'taskTimeout' in configuration!");

      on('task', {
        async getIncoming([subPath, expectedTimestamp]) {
          return getIncoming(subPath, expectedTimestamp, taskTimeout - 1000 /*ms*/)
        }
      })

      // Note: Samples return 'config' but that doesn't seem to be required. (Cypress 10.7.0)

      function fail(msg) { throw new Error(msg) }
    },

    // If tests take longer, the color they are reported in turns yellow (otherwise gray). (default: 10000)
    //
    slowTestThreshold: 1500,

    // Note: Not sure if this is enough to not need 'clearAuthState' in tests. Experiment!!!
    //
    // Strict mode
    //  -> https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Strict-Mode
    //
    experimentalSessionAndOrigin: true
  }
})

