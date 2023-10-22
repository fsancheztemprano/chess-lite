const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageReporters: ['lcov', 'html'],
  setupFilesAfterEnv: ['jest-extended/all'],
  coveragePathIgnorePatterns: ['/node_modules/', '^.*\\.(stub|mock|model|module)\\.ts$'],
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@ngneat/effects|@ngneat/effects-ng|url-template)'],
};
