const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  rootDir: '../',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.svg': '<rootDir>/.jest/__mocks__/svgrMock.tsx',
    // '^@/components/(.*)$': '<rootDir>/components/$1',
    '@shared(.*)$': '<rootDir>/src/components/@shared/$1',
    '@hooks/(.*)$': '<rootDir>/src/@hooks/$1',
    '@context/(.*)$': '<rootDir>/src/@context/$1',
    '@images/(.*)$': '<rootDir>/src/@images/$1',
    '@utils/(.*)$': '<rootDir>/src/@utils/$1',
    '@content/(.*)$': '<rootDir>/@content/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{stories,test}.{ts,tsx}',
    '!src/@types/**/*.{ts,tsx}'
  ],
  testPathIgnorePatterns: ['node_modules', '\\.cache', '.next', 'coverage']
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
