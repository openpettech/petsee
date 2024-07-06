module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  rootDir: 'src',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
    '^@modules/(.*)$': '<rootDir>/../src/modules/$1',
    '^@utils/(.*)$': '<rootDir>/../src/shared/utils/$1',
    '^@providers/(.*)$': '<rootDir>/../src/shared/providers/$1',
    '^@contracts/(.*)$': '<rootDir>/../src/contracts/$1',
    '^@shared/(.*)$': '<rootDir>/../src/shared/$1',
    '^@decorators/(.*)$': '<rootDir>/../src/shared/decorators/$1',
    '^@config/(.*)$': '<rootDir>/../src/config/$1',
    '^@constants/(.*)$': '<rootDir>/../src/constants/$1',
  },
  modulePathIgnorePatterns: ['src/typings'],
  testPathIgnorePatterns: [
    '/node_modules./',
    '<rootDir>/(coverage|dist|lib|tmp)./',
  ],
};
