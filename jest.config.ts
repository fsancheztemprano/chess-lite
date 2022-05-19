const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: getJestProjects(),
  coveragePathIgnorePatterns: ['^.*\\.(stub|mock|model|module)\\.ts$'],
};
