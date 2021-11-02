interface DDO {
  // DDO spec
  '@context': string[]
  id: string
  created: string
  updated: string
  version: string
  chainId: number
  metadata: Metadata
  services: Service[]
  credentials?: {
    allow: Credential[]
    deny: Credential[]
  }
  status: {
    status: 0 | 1 | 2 | 3
    isListed?: boolean
    isOrderDisabled?: boolean
  }
}
