import '@testing-library/jest-dom/extend-expect'

beforeAll(() => {
  require('./__mocks__/matchMedia')
  jest.mock('web3')
})
