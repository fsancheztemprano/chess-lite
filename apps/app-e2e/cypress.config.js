const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: false,
  videosFolder: '../../dist/cypress/apps/app-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/app-e2e/screenshots',
  chromeWebSecurity: false,

  e2e: {
    supportFile: './src/support/index.ts',
    specPattern: './src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
