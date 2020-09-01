import '@testing-library/jest-dom/extend-expect'
import * as Gatsby from 'gatsby'
import siteMetadata from './__fixtures__/siteMetadata.json'
// import mockReact from './__mocks__/@oceanprotocol/react'

if (typeof window.IntersectionObserver === 'undefined') {
  import('intersection-observer')
}

import('./__mocks__/matchMedia')

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery')
// const useWeb3 = jest.spyOn(oceanReact, 'useWeb3')
// const useOcean = jest.spyOn(oceanReact, 'useOcean')

export const globalMock = {
  ...siteMetadata
}

beforeAll(() => {
  jest.mock('web3')
  jest.mock('@oceanprotocol/react')

  // useOcean.mockImplementation(() => mockReact.useOcean())
  useStaticQuery.mockImplementation(() => globalMock)
})
