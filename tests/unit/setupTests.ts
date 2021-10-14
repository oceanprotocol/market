import '@testing-library/jest-dom/extend-expect'
import * as Gatsby from 'gatsby'
import siteMetadata from './__fixtures__/siteMetadata.json'
import gdprMetadata from './__fixtures__/gdprMetadata.json'
import UserPreferences from './__fixtures__/useUserPreferences'
import * as UseUserPreferences from '../../src/providers/UserPreferences'

import('./__mocks__/matchMedia')

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery')
const useUserPreferences = jest.spyOn(UseUserPreferences, 'useUserPreferences')
// const useWeb3 = jest.spyOn(oceanReact, 'useWeb3')
// const useOcean = jest.spyOn(oceanReact, 'useOcean')

export const globalMock = {
  ...siteMetadata,
  ...gdprMetadata
}

beforeAll(() => {
  jest.mock('web3')
  jest.mock('@oceanprotocol/lib')
  // useOcean.mockImplementation(() => mockReact.useOcean())
  useStaticQuery.mockImplementation(() => globalMock)
  useUserPreferences.mockImplementation(() => UserPreferences)
})
