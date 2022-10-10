import '@testing-library/jest-dom/extend-expect'
import './__mocks__/matchMedia'
import marketMetadataMock from './__mocks__/MarketMetadata'
import userPreferencesMock from './__mocks__/UserPreferences'

jest.mock('../../src/@context/MarketMetadata', () => ({
  useMarketMetadata: () => marketMetadataMock
}))

jest.mock('../../src/@context/UserPreferences', () => ({
  useUserPreferences: () => userPreferencesMock
}))
