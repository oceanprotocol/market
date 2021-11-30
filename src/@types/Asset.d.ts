interface AssetNft {
  address: string
  name: string
  symbol: string
  owner: string
  state: 0 | 1 | 2 | 3 | 4
}

interface AssetDatatoken {
  name: string
  symbol: string
  address: string
  serviceId: string
}

interface AssetLastEvent {
  tx: string
  block: number
  from: string
  contract: string
}

interface Asset extends DDO {
  nft: AssetNft
  datatokens: AssetDatatoken[]
  event: AssetLastEvent
  stats: { consume: number }
  isInPurgatory: string

  // This is fake and most likely won't be used like this.
  // Just here so we can continue to have successful builds.
  dataTokenInfo: AssetDatatoken
}
