import { FileInfo } from '@oceanprotocol/lib'
export interface MetadataEditForm {
  name: string
  description: string
  timeout: string
  price?: string
  links?: string[] | FileInfo[]
  files: FileInfo[]
  author?: string
}

export interface ComputeEditForm {
  allowAllPublishedAlgorithms: boolean
  publisherTrustedAlgorithms: string[]
  publisherTrustedAlgorithmPublishers: string[]
}
