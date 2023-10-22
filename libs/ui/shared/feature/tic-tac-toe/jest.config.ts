/* eslint-disable */
export default {
  displayName: 'ui-shared-feature-tic-tac-toe',
  preset: '../../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../../../coverage/libs/ui/shared/feature/tic-tac-toe',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/libs/ui/shared/feature/tic-tac-toe',
        outputName: 'jest-junit.xml',
      },
    ],
  ],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
