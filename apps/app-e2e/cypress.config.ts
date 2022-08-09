import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: '../../coverage/apps/app-e2e/cypress-junit-[hash].xml',
  },

  e2e: {
    ...nxE2EPreset(__dirname),
    fileServerFolder: '.',
    fixturesFolder: './src/fixtures',
    video: false,
    videosFolder: '../../coverage/apps/app-e2e/videos',
    screenshotsFolder: '../../coverage/apps/app-e2e/screenshots',
    chromeWebSecurity: false,
    supportFile: 'src/support/e2e.ts',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});