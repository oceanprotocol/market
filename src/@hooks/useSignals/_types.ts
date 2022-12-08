import { SignalOriginItem } from '../../@context/Signals/_types'

export interface UseSignals {
  // We need to create variables that store the available assets and profiles for the relevant signals to then be fetched.
  signalItems: SignalOriginItem[]
  assetIds?: string[]
  publisherIds?: string[]
  userAddresses: string[]
  loading: boolean
  setAssetIds?(assets: string[]): void
  setPublisherIds(publisherIds: string[]): void
  setUserAddresses(userAddresses: string[]): void
}
