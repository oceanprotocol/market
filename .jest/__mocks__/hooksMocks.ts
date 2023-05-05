import marketMetadata from '../__fixtures__/marketMetadata'
import userPreferences from '../__fixtures__/userPreferences'
import { network } from '../__fixtures__/wagni'
import { asset } from '../__fixtures__/datasetWithAccessDetails'

jest.mock('../../src/@context/MarketMetadata', () => ({
  useMarketMetadata: () => marketMetadata
}))

jest.mock('../../src/@context/UserPreferences', () => ({
  useUserPreferences: () => userPreferences
}))

jest.mock('../../../@context/Asset', () => ({
  useAsset: () => ({ asset })
}))

jest.mock('wagmi', () => ({
  useNetwork: () => ({ network }),
  useSwitchNetwork: () => ({ switchNetwork: () => jest.fn() }),
  useProvider: () => jest.fn(),
  createClient: () => jest.fn()
}))
