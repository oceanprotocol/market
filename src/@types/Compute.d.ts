import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'

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
}
