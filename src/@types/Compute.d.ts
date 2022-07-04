import { ComputeJob } from '@oceanprotocol/lib'
import { OrdersData_orders_datatoken as OrdersDatatoken } from '../@types/subgraph/OrdersData'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface ComputeJobMetaData extends ComputeJob {
    assetName: string
    assetDtSymbol: string
    networkId: number
  }

  interface AlgorithmOption {
    did: string
    name: string
  }

  interface TokenOrder {
    id: string
    serviceIndex: number
    datatoken: OrdersDatatoken
    tx: any
    createdTimestamp: number
  }

  interface ComputeResults {
    computeJobs: ComputeJobMetaData[]
    isLoaded: boolean
  }
}
