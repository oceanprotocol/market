module.exports = {
  rootDir: '../../',
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './jest/babel.config.js' }]
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/unit/__mocks__/file-mock.js',
    '\\.svg': '<rootDir>/tests/unit/__mocks__/svgr-mock.js'
  },
  testPathIgnorePatterns: ['node_modules', '.cache', 'public', 'coverage'],
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  globals: {
    __PATH_PREFIX__: ''
  },
  setupFiles: ['<rootDir>/tests/unit/loadershim.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/@types/**/*',
    '!<rootDir>/src/**/*.stories.{ts,tsx}'
  ],
  collectCoverage: true
}
