import { Asset } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import { AssetExtended } from 'src/@types/AssetExtended'

export const locale: string = 'en-US'

export const asset: Asset = {
  '@context': ['https://w3id.org/did/v1'],
  purgatory: {
    state: true,
    reason: ''
  },
  stats: { consume: -1 },
  chainId: 4,
  datatokens: [
    {
      address: '0x9773173aa83064B2e6092Ab154Be30e9Ea317258',
      name: 'Comely Herring Token',
      serviceId:
        'f4d9a48f1a229e00edd69630b138c05ea50d82d47caba8aadd701b9c43213628',
      symbol: 'COMHER-98'
    }
  ],
  event: {
    block: 10771807,
    contract: '0x58390B3527A3Ac42F92bF2A12a29fFBE832206bA',
    datetime: '2022-05-31T11:17:52',
    from: '0x491AECC4b3d690a4D7027A385499fd04fE50b796',
    tx: '0xa5abd03b5804918fe5e13145ab511e536da66b73fd8123fe2a6aff47ea2a221b'
  },
  id: 'did:op:72468f062a26f9eb668b6392a0bbdeebd33f889b2c31e2c91768eba35a31cd94',
  metadata: {
    additionalInformation: {
      termsAndConditions: true
    },
    author: 'EVJ',
    created: '2022-05-30T13:51:59Z',
    description: 'Space Situational Awareness: TLE Data + Visualization',
    license: 'https://market.oceanprotocol.com/terms',
    name: 'Space Situational Awareness: TLE Data + Visualization',
    tags: ['open-data'],
    type: 'dataset',
    updated: '2022-05-30T13:51:59Z'
  },
  nft: {
    address: '0x58390B3527A3Ac42F92bF2A12a29fFBE832206bA',
    created: '2022-05-30T13:52:09',
    name: 'Ocean Data NFT',
    owner: '0x491AECC4b3d690a4D7027A385499fd04fE50b796',
    state: 0,
    symbol: 'OCEAN-NFT',
    tokenURI:
      'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDo3MjQ2OGYwNjJhMjZmOWViNjY4YjYzOTJhMGJiZGVlYmQzM2Y4ODliMmMzMWUyYzkxNzY4ZWJhMzVhMzFjZDk0IiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjcyNDY4ZjA2MmEyNmY5ZWI2NjhiNjM5MmEwYmJkZWViZDMzZjg4OWIyYzMxZTJjOTE3NjhlYmEzNWEzMWNkOTQiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDI1QzEzLDI1IDI2LDI1IDM2LDI0QzQ1LDIyIDUyLDE5IDYyLDIwQzcxLDIwIDg1LDI1IDk5LDMwTDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw0MkMxMiw0NSAyNSw0OCAzNyw1MEM0OCw1MSA1OCw1MCA2OSw1MUM3OSw1MSA4OSw1MyA5OSw1NUw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmZmJyBkPSdNMCw5OUwwLDc5QzksODAgMTksODEgMzAsODBDNDAsNzggNTEsNzMgNjMsNzJDNzQsNzAgODYsNzEgOTksNzJMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDL3N2ZyUzRSJ9'
  },
  nftAddress: '0x58390B3527A3Ac42F92bF2A12a29fFBE832206bA',
  services: [
    {
      datatokenAddress: '0x9773173aa83064B2e6092Ab154Be30e9Ea317258',
      files:
        '0x04e61c511bdc8021779064e53972031d27d2afa53298ac85b8cca80cb9e1b45a0a3f2a71c0261b2f9d224fa78cf03f116a817c74aac5d96dd7164e47c6d0a508e0ef1a58226ceb8f26df474a4cb3dd2a15080e4dfbc94ccf07914f0bd036eb59972164bc5c7990f71da70160f749e6bfcf302a584a7a05d529fa9a4319df088a772be109cf58f6fcab38be565d87fc8adc0b895527f04742193e2aab81f1f6f148b1cac579bb99ea8bf6e6259d9156f769f3255e91437b34f581cb4ae83cd020730d6f41f29094fffdb2ad8ebf7844e6907f0ef86628222c14dfb8',
      id: 'f4d9a48f1a229e00edd69630b138c05ea50d82d47caba8aadd701b9c43213628',
      serviceEndpoint: 'https://v4.provider.rinkeby.oceanprotocol.com',
      timeout: 604800,
      type: 'access'
    }
  ],
  version: '4.0.0'
}

export const assetExtended: AssetExtended = {
  ...asset,
  accessDetails: {
    isOwned: true,
    validOrderTx:
      '0xfd9e9e4688589a231be9b17932abd8137890ab5f03ab475196442f3369cc4f4f',
    publisherMarketOrderFee: '0',
    type: 'free',
    addressOrId: '0x9773173aa83064b2e6092ab154be30e9ea317258',
    price: '0',
    isPurchasable: true,
    datatoken: {
      address: '0x9773173aa83064b2e6092ab154be30e9ea317258',
      name: 'Comely Herring Token',
      symbol: 'COMHER-98'
    }
  }
}

export const assetSelectionAsset: AssetSelectionAsset[] = [
  {
    did: 'did:op:408538d6c10a45925b880db726b1eca87dffefb439c6442c00a78c0ace0d90e3',
    name: 'Small Arms & Ammunition: Price of War Algorithm',
    price: '3',
    checked: false,
    symbol: 'JUDKRI-62'
  },
  {
    did: 'did:op:31eca1f32e593b8572cacca4fff75eb3d39ca2ae2dd2c6b08d069575ac73bbd6',
    name: 'Space Situational Awareness: TLE Data + Visualization',
    price: '2.086680902897933865',
    checked: false,
    symbol: 'DELBAR-47'
  },
  {
    did: 'did:op:40bc6de6055bb5eed6935e5f75080c465fd1ce867362df7dd20e142830aebcff',
    name: 'Space Situational Awareness: Two Line Element Data Only',
    price: '2.012072434607645876',
    checked: false,
    symbol: 'BOOTUN-64'
  },
  {
    did: 'did:op:96760f9743b2f07dc0fe9300e20df769cb4593c498bab957de392437cc360ac4',
    name: 'Small Arms & Ammunition: Data Only',
    price: '1',
    checked: false,
    symbol: 'VIBOTT-81'
  }
]

export const assets = [asset, asset, asset, asset]
