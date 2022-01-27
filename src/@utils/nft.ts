import { SvgWaves } from './SvgWaves'

// https://docs.opensea.io/docs/metadata-standards
export interface NftMetadata {
  name: string
  symbol: string
  description: string
  image?: string
  /* eslint-disable camelcase */
  external_url?: string
  image_data?: string
  background_color?: string
  /* eslint-enable camelcase */
}

function encodeSvg(svgString: string): string {
  return svgString
    .replace(
      '<svg',
      ~svgString.indexOf('xmlns')
        ? '<svg'
        : '<svg xmlns="http://www.w3.org/2000/svg"'
    )
    .replace('></path>', '/>')
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')
}

export function generateNftMetadata(): NftMetadata {
  const waves = new SvgWaves()
  const svg = waves.generateSvg()

  // TODO: figure out if also image URI needs base64 encoding
  // e.g. 'data:image/svg+xml;base64,'
  // generated SVG embedded as 'data:image/svg+xml' and encoded characters
  const imageData = `data:image/svg+xml,${encodeSvg(svg.outerHTML)}`

  const newNft: NftMetadata = {
    name: 'Ocean Asset NFT',
    symbol: 'OCEAN-NFT',
    description: `This NFT represents an asset in the Ocean Protocol v4 ecosystem.`,
    // TODO: ideally this includes the final DID
    external_url: 'https://market.oceanprotocol.com',
    background_color: '141414', // dark background
    image_data: imageData
  }

  console.log('image data:', imageData)

  return newNft
}

export function generateNftCreateData(nftMetadata: NftMetadata): any {
  // TODO: figure out if Buffer.from method is working in browser in final build
  // as BTOA is deprecated.
  // tokenURI: window?.btoa(JSON.stringify(nftMetadata))
  const encodedMetadata = Buffer.from(JSON.stringify(nftMetadata)).toString(
    'base64'
  )

  const nftCreateData = {
    name: nftMetadata.name,
    symbol: nftMetadata.symbol,
    templateIndex: 1,
    tokenURI: `data:application/json;base64,${encodedMetadata}`
  }

  return nftCreateData
}
