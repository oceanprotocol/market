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
  copyrightHolder?: string
  contentLanguage?: string
  algorithm?: MetadataAlgorithm
  additionalInformation?: any
}
