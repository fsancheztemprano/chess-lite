const { getJestProjects } = require('@nx/jest');

export default {
  projects: getJestProjects().filter((p: string) => p !== 'consumer-pact'),
};
