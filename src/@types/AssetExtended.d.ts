import { Asset, Event } from '@oceanprotocol/ddo-js'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface AssetExtended extends Asset {
    accessDetails?: AccessDetails
    views?: number
    // indexedMetadata?: any
    event?: Event
    datatokens?: Datatoken[]
  }
}
