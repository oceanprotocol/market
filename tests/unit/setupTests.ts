import '@testing-library/jest-dom/extend-expect'

if (typeof window.IntersectionObserver === 'undefined') {
  import('intersection-observer')
}

beforeAll(() => {
  require('./__mocks__/matchMedia')
  jest.mock('web3')
})
