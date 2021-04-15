import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'

export interface ComputeJobMetaData extends ComputeJob {
  assetName: string
  algoName: string
  timestamp: number
  type: string
}
