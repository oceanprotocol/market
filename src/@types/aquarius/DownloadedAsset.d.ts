import { DDO } from '@oceanprotocol/lib'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface DownloadedAsset {
    dtSymbol: string
    timestamp: number
    networkId: number
    ddo: DDO
  }
}
