interface PublisherTrustedAlgorithm {
  did: string
  filesChecksum: string
  containerSectionChecksum: string
}

interface ServiceComputePrivacy {
  allowRawAlgorithm: boolean
  allowNetworkAccess: boolean
  publisherTrustedAlgorithmPublishers: string[]
  publisherTrustedAlgorithms: PublisherTrustedAlgorithm[]
}

interface Service {
  type: 'access' | 'compute' | string
  datatokenAddress: string
  providerUrl: string
  timeout: string
  name?: string
  description?: string
  privacy?: ServiceComputePrivacy
}
