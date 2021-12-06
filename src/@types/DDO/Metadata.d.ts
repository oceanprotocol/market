interface MetadataAlgorithmContainer {
  entrypoint: string
  image: string
  tag: string
  checksum: string
}

interface MetadataAlgorithm {
  language?: string
  version?: string
  container: MetadataAlgorithmContainer
}

interface Metadata {
  created: string
  updated: string
  name: string
  description: string
  type: 'dataset' | 'algorithm' | string
  author: string
  license: string
  links?: string[]
  tags?: string[]
  copyrightHolder?: string
  contentLanguage?: string
  algorithm?: MetadataAlgorithm
  additionalInformation?: any
}
