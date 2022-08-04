import { defineConfig } from 'cypress';

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: '../../coverage/apps/app-e2e/videos',
  screenshotsFolder: '../../coverage/apps/app-e2e/screenshots',
  chromeWebSecurity: false,

  reporter: 'junit',
  reporterOptions: {
    mochaFile: '../../coverage/apps/app-e2e/cypress-junit-[hash].xml',
  },

  e2e: {
    supportFile: './src/support/index.ts',
    specPattern: './src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
