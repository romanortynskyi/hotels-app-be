module.exports = {
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1'
  },
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '!<rootDir>/node_modules/*',
    '!<rootDir>/tests/**/*',
    '!<rootDir>/consts/*',
    '!<rootDir>/config/*',
    '!<rootDir>/models/*',
    '!<rootDir>/migrations/*',
    '!<rootDir>/docs/*',
    '!<rootDir>/emails/*',
    '!<rootDir>/*.json',
    '!<rootDir>/*.yaml'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['html', 'lcov'],
  coverageDirectory: '<rootDir>/tests/coverage',
  testTimeout: 12000,
  testMatch: ['<rootDir>/tests/**/*.spec.js'],
}
