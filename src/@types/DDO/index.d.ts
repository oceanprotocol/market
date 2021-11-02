interface DDO {
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

// interface MetadataEditForm {
//   name: string
//   description: string
//   timeout: string
//   price?: number
//   links?: string | EditableMetadataLinks[]
//   author?: string
// }
