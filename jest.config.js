module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts', 'py'],
  rootDir: 'src',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@stock-price/(.*)$': '<rootDir>/yahoo-client/stock/stock-price/$1',
    '^@stock-report/(.*)$': '<rootDir>/yahoo-client/stock/stock-report/$1',
    '^@stock/(.*)$': '<rootDir>/yahoo-client/stock/$1',
    '^@utility/(.*)$': '<rootDir>/yahoo-client/utility/$1',
    '^@python-executor/(.*)$': '<rootDir>/yahoo-client/utility/python-executor/$1',
    '^@python/(.*)$': '<rootDir>/yahoo-client/utility/python/$1',
    '^@date-range/(.*)$': '<rootDir>/yahoo-client/utility/ts-services/date-range/$1',
    '^@date-parser/(.*)$': '<rootDir>/yahoo-client/utility/date-parser/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
};
