const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: getJestProjects().filter((p: string) => p !== 'consumer-pact'),
};
