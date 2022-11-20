import nextJest from 'next/jest'
import type { Config } from 'jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  rootDir: '../',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.ts'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/.jest/__mocks__/svgrMock.tsx',
    '@components/(.*)$': '<rootDir>/src/components/$1',
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
  // Add ignores so ESM packages are not transformed by Jest
  // note: this does not work with Next.js, hence workaround further down
  // see: https://github.com/vercel/next.js/issues/35634#issuecomment-1115250297
  // transformIgnorePatterns: ['node_modules/(?!(uuid|remark)/)'],
  testPathIgnorePatterns: ['node_modules', '\\.cache', '.next', 'coverage']
}

// https://github.com/vercel/next.js/issues/35634#issuecomment-1115250297
async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)()

  // Add ignores so ESM packages are not transformed by Jest
  // /node_modules/ is the first pattern
  nextJestConfig.transformIgnorePatterns[0] = '/node_modules/(?!uuid|remark)/'
  return nextJestConfig
}

export default jestConfig
