/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  // jest-fixed-jsdom restores Node web globals (fetch, ReadableStream, ...) that
  // @firebase/auth needs but stock jsdom omits under jest 30.
  testEnvironment: 'jest-fixed-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/e2e/'],
  moduleNameMapper: {
    '^@models$': '<rootDir>/src/models',
    '^@services$': '<rootDir>/src/app/services',
    '^@functions$': '<rootDir>/src/app/functions',
    '^@store$': '<rootDir>/src/app/store',
    '^@directives$': '<rootDir>/src/app/directives',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@assets$': '<rootDir>/src/assets',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  // Allow Jest to transform ESM-only deps that ship untranspiled ES modules.
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@angular|@ngrx|rxjs|primeng|@primeng|@primeuix|firebase|@firebase|tslib|ngx-toastr|ng-lazyload-image|bad-words|badwords-list|sift))',
  ],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    'src/models/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/index.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/**/environment*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
};
