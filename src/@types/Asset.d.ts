interface Asset extends DDO {
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

  // This is fake and most likely won't be used.
  // Just here so we can continue to have successful builds.
  dataTokenInfo: {
    name: string
    symbol: string
    address: string
  }

  isInPurgatory: string
}

// interface MetadataEditForm {
//   name: string
//   description: string
//   timeout: string
//   price?: number
//   links?: string | EditableMetadataLinks[]
//   author?: string
// }
