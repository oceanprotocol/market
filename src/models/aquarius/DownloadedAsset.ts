import { DDO } from '@oceanprotocol/lib'

export interface DownloadedAsset {
  dtSymbol: string
  timestamp: number
  networkId: number
  ddo: DDO
}
