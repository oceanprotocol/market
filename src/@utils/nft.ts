export interface NftOptions {
  name: string
  symbol: string
  tokenURI: string
}

export function generateNftOptions(): NftOptions {
  const newNft: NftOptions = {
    name: 'Ocean Asset v4',
    symbol: 'OCEAN-V4',
    tokenURI: ''
  }

  return newNft
}
