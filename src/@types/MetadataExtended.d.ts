import { Metadata } from '@oceanprotocol/lib'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface MetadataExtended extends Metadata {
    algorithm?: MetadataAlgorithm & {
      consumerParameters: ConsumerParameter[]
    }
  }
}
