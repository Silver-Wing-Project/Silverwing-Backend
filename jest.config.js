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
  },
};
