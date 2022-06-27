export interface MetadataEditForm {
  name: string
  description: string
  timeout: string
  price?: string
  links?: string | any[]
  files: string | any[]
  author?: string
  tags?: string[]
}

export interface ComputeEditForm {
  allowAllPublishedAlgorithms: boolean
  publisherTrustedAlgorithms: string[]
  publisherTrustedAlgorithmPublishers: string[]
}
