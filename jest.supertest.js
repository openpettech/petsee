const sharedConfig = require('./jest.config');

module.exports = {
  ...sharedConfig,
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.supertest-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
