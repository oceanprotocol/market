interface DDO {
  // DDO spec
  '@context': string[]
  id: string
  created: string
  updated?: string
  version: string
  chainId: number
  files: FileMetadata[]
  metadata: Metadata
  services: Service[]
  status: {
    state: 0 | 1 | 2 | 3
    isListed?: boolean
    isOrderDisabled?: boolean
  }
  credentials?: {
    allow: Credential[]
    deny: Credential[]
  }
}
