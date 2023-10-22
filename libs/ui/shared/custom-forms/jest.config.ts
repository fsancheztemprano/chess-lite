/* eslint-disable */
export default {
  displayName: 'ui-shared-custom-forms',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../../../coverage/libs/ui/shared/custom-forms',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/libs/ui/shared/custom-forms',
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
