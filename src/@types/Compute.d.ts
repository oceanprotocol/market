import { ComputeJob } from '@oceanprotocol/lib'
import { OrdersData_tokenOrders_datatokenId as OrdersDatatoken } from './apollo/OrdersData'

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

  interface ComputePrivacyForm {
    allowAllPublishedAlgorithms: boolean
    publisherTrustedAlgorithms: string[]
  }

  interface TokenOrder {
    id: string
    serviceId: number
    datatokenId: OrdersDatatoken
    tx: any
    timestamp: number
  }

  interface ComputeResults {
    computeJobs: ComputeJobMetaData[]
    isLoaded: boolean
  }
}
