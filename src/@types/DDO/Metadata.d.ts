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
