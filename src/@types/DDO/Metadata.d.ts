interface MetadataAlgorithm {
  language?: string
  version?: string
  container: {
    entrypoint: string
    image: string
    tag: string
    checksum: string
  }
}

interface Metadata {
  name: string
  description: string
  type: 'dataset' | 'algorithm'
  author: string
  license: string
  links?: string[]
  tags?: string[]
  algorithm?: MetadataAlgorithm
  copyrightHolder?: string
  contentLanguage?: string
  additionalInformation?: any
}
