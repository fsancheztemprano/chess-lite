const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/chess-app',
    '<rootDir>/libs/hal-form-client',
    '<rootDir>/libs/domain',
  ],
};
