import marketMetadata from '../__fixtures__/marketMetadata'
import userPreferences from '../__fixtures__/userPreferences'
import web3 from '../__fixtures__/web3'
import { asset } from '../__fixtures__/datasetWithAccessDetails'

jest.mock('../../src/@context/MarketMetadata', () => ({
  useMarketMetadata: () => marketMetadata
}))

jest.mock('../../src/@context/UserPreferences', () => ({
  useUserPreferences: () => userPreferences
}))

jest.mock('../../src/@context/Web3', () => ({
  useWeb3: () => web3
}))

jest.mock('../../../@context/Asset', () => ({
  useAsset: () => ({ asset })
}))
