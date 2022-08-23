import '@testing-library/jest-dom/extend-expect'
import './__mocks__/matchMedia'
import marketMetadataMock from './__mocks__/MarketMetadata'

jest.mock('../../src/@context/MarketMetadata', () => ({
  useMarketMetadata: () => marketMetadataMock
}))
