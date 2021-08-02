import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'

export interface ComputeJobMetaData extends ComputeJob {
  assetName: string
  assetDtSymbol: string
  networkId: number
}
