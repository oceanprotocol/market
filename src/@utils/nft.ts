export interface NftOptions {
  name: string
  symbol: string
  description: string
  image: string
}

function encodeSvg(svgString: string): string {
  return svgString
    .replace(
      '<svg',
      ~svgString.indexOf('xmlns')
        ? '<svg'
        : '<svg xmlns="http://www.w3.org/2000/svg"'
    )
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')
}

export function generateNftOptions(): NftOptions {
  const image = '<svg></svg>'
  const newNft: NftOptions = {
    name: 'Ocean Asset v4',
    symbol: 'OCEAN-V4',
    description: `This NFT represents an asset in the Ocean Protocol v4 ecosystem.`,
    image: `data:image/svg+xml,${encodeSvg(image)}` // generated SVG embedded as 'data:image/svg+xml;base64'
  }

  return newNft
}

export function generateNftCreateData(nftOptions: NftOptions): any {
  const nftCreateData = {
    name: nftOptions.name,
    symbol: nftOptions.symbol,
    templateIndex: 1,
    tokenURI: Buffer.from(JSON.stringify(nftOptions)).toString('base64') // data:application/json;base64
  }

  return nftCreateData
}
