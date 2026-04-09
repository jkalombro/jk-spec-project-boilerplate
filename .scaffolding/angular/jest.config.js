module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testRegex: '.*\\.spec\\.ts$',
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|ngxtension))'],
  moduleNameMapper: {
    '.*environments/environment$': '<rootDir>/src/__mocks__/environment.js',
  },
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
};
