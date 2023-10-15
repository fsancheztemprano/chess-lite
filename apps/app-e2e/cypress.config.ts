import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'fcegyj',
  reporter: 'junit',
  reporterOptions: {
    mochaFile: '../../coverage/apps/app-e2e/cypress-junit-[hash].xml',
  },

  env: {
    apiUrl: '/api',
    emailUrl: 'http://localhost:8025',
  },

  e2e: {
    ...nxE2EPreset(__filename),
    fileServerFolder: '.',
    fixturesFolder: './src/fixtures',
    video: true,
    videosFolder: '../../coverage/apps/app-e2e/videos',
    screenshotsFolder: '../../coverage/apps/app-e2e/screenshots',
    chromeWebSecurity: false,
    supportFile: 'src/support/e2e.ts',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
