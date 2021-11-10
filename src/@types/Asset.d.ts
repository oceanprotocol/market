interface AssetNft {
  address: string
  name: string
  symbol: string
  owner: string
}

interface AssetDatatoken {
  name: string
  symbol: string
  address: string
}

interface AssetEvent {
  tx: string
  block: number
  from: string
  contract: string
}

interface Asset extends DDO {
  nft: AssetNft
  datatokens: AssetDatatoken[]
  events: AssetEvent[]
  stats: { consume: number }

  // This is fake and most likely won't be used like this.
  // Just here so we can continue to have successful builds.
  dataTokenInfo: AssetDatatoken

  isInPurgatory: string
}
