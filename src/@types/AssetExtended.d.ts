import { Asset } from '@oceanprotocol/lib'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface AssetExtended extends Asset {
    accessDetails?: AccessDetails
    views?: number
  }
}
