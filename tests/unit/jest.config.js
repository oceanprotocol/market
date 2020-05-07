module.exports = {
  rootDir: '../../',
  preset: 'ts-jest/presets/js-with-ts',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'jest.tsconfig.json'
    }
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'md'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|md)$':
      '<rootDir>/tests/unit/__mocks__/fileMock.js',
    '\\.svg': '<rootDir>/tests/unit/__mocks__/svgrMock.js',
    'next/router': '<rootDir>/tests/unit/__mocks__/nextRouter.js'
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next',
    '<rootDir>/node_modules',
    '<rootDir>/build',
    '<rootDir>/coverage'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/@types/**/*',
    '!<rootDir>/src/**/*.stories.{ts,tsx}'
  ],
  collectCoverage: true
}
