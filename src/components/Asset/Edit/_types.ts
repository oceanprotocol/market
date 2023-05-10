import { ConsumerParameter } from '@components/Publish/_types'
import { FileInfo } from '@oceanprotocol/lib'
export interface MetadataEditForm {
  name: string
  description: string
  timeout: string
  paymentCollector: string
  price?: string
  files: FileInfo[]
  links?: FileInfo[]
  author?: string
  tags?: string[]
  usesConsumerParameters?: boolean
  consumerParameters?: ConsumerParameter[]
  assetState?: string
  service?: {
    usesConsumerParameters?: boolean
    consumerParameters?: ConsumerParameter[]
  }
}

export interface ComputeEditForm {
  allowAllPublishedAlgorithms: boolean
  publisherTrustedAlgorithms: string[]
  publisherTrustedAlgorithmPublishers: string[]
}
