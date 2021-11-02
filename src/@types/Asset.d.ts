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
}

// interface MetadataEditForm {
//   name: string
//   description: string
//   timeout: string
//   price?: number
//   links?: string | EditableMetadataLinks[]
//   author?: string
// }
