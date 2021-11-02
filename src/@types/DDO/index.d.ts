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

  // The following is added by Aquarius on top of what's on-chain
  nft: {
    address: string
    name: string
    symbol: string
    owner: string
  }

  events: {
    txid: string
    blockNo: number
    from: string
    contract: string
    update: boolean
    chainId: number
  }[]

  stats: {
    consume: number
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
