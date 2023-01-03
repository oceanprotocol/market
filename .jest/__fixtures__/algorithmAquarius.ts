import { Asset } from '@oceanprotocol/lib'

export const algorithmAquarius: Asset = {
  '@context': ['https://w3id.org/did/v1'],
  id: 'did:op:6654b0793765b269696cec8d2f0d077d9bbcdd3c4f033d941ab9684e8ad06630',
  nftAddress: '0xbA5BA7B09e2FA1eb0258f647503F81D2Af5cb07d',
  version: '4.1.0',
  chainId: 1,
  metadata: {
    created: '2022-09-29T11:30:26Z',
    updated: '2022-09-29T11:30:26Z',
    type: 'algorithm',
    name: 'algorithmTestitest',
    description: 'This is an algorithm test.',
    links: ['https://www.oceanprotocol.com/sample'],
    tags: [
      'trading',
      'defi',
      'algorithm',
      'algorithmic-crypto-trading',
      'algo-trading',
      'trading-strategy',
      'cryptocurrency',
      'crypto'
    ],
    author: 'Test User',
    license: 'https://market.oceanprotocol.com/terms',
    additionalInformation: {
      termsAndConditions: true
    },
    algorithm: {
      language: 'json',
      version: '0.1',
      container: {
        entrypoint: 'python $algo',
        tag: 'latest',
        image: 'https://docker.com/test.img',
        checksum: ''
      }
    }
  },
  services: [
    {
      id: 'dbc42f4c62d2452f8731fd023eacfae74e9c7a42fbd12ce84310f13342e4aab1',
      type: 'access',
      files:
        '0x04022ef1afafe340f41b261ef721b8dd55dee094975cc70330803d760beef38871948ce572ff1c533d56cda2665749ed2eb8283e243ec5ee19011f510b6b263b2da0af537e3f1fdff7ddd90fa26c7a4761a6d26928bc1348a302634012aac7998e92c84456ab73e9a847120c44ebda15781787e8c382391b2eaefc8b8d36998f3998d1c4647f4f7bb28f4278093c1d231f66e78f81452049443b9e540aeb42ebbdc1b748c024eb10218532814736e241efa1c2a687685b4e2ea7a877685aa0ea325d1a8cf765d1b423b32d81ec3c3e22fc9c15c6b9b71f2862edaec4e4cf7c3a638ffc0ecb88ede3cabb511d4780543a53c001a95f42de1877796e13c997b57bc671507e92198934b4ea7c2e6554993388421253e8c2f10458dec872a7ebfa71b6e77ed359222c93261ba252028c5da06ccf8defcd529885b2125816325a47e23728b513',
      datatokenAddress: '0x067e1E6ec580F3F0f6781679A4A5AB07A6464b08',
      serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
      timeout: 604800
    }
  ],
  event: {
    tx: '0x3e07a75c1cc5d4146222a93ab4319144e60ecca3ebfb8b15f1ff339d6f479dc9',
    block: 7680195,
    from: '0x903322C7E45A60d7c8C3EA236c5beA9Af86310c7',
    contract: '0xbA5BA7B09e2FA1eb0258f647503F81D2Af5cb07d',
    datetime: '2022-09-29T11:31:12'
  },
  nft: {
    address: '0xbA5BA7B09e2FA1eb0258f647503F81D2Af5cb07d',
    name: 'Ocean Data NFT',
    symbol: 'OCEAN-NFT',
    state: 0,
    tokenURI:
      'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDo2NjU0YjA3OTM3NjViMjY5Njk2Y2VjOGQyZjBkMDc3ZDliYmNkZDNjNGYwMzNkOTQxYWI5Njg0ZThhZDA2NjMwIiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjY2NTRiMDc5Mzc2NWIyNjk2OTZjZWM4ZDJmMGQwNzdkOWJiY2RkM2M0ZjAzM2Q5NDFhYjk2ODRlOGFkMDY2MzAiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDI5QzksMjUgMTksMjIgMjksMjFDMzgsMTkgNDksMTkgNjEsMjFDNzIsMjIgODUsMjUgOTksMjlMOTksOTlaJy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmJiJyBkPSdNMCw5OUwwLDU1QzgsNDkgMTcsNDQgMjgsNDNDMzgsNDEgNTAsNDIgNjMsNDNDNzUsNDMgODcsNDIgOTksNDJMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJmZicgZD0nTTAsOTlMMCw2OEMxMSw2NiAyMiw2NSAzMiw2N0M0MSw2OCA1MCw3MyA2MSw3NkM3MSw3OCA4NSw3OCA5OSw3OUw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0Mvc3ZnJTNFIn0=',
    owner: '0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0',
    created: '2022-09-29T11:31:12'
  },
  datatokens: [
    {
      address: '0x067e1E6ec580F3F0f6781679A4A5AB07A6464b08',
      name: 'Stupendous Orca Token',
      symbol: 'STUORC-59',
      serviceId:
        'dbc42f4c62d2452f8731fd023eacfae74e9c7a42fbd12ce84310f13342e4aab1'
    }
  ],
  stats: {
    orders: 22,
    price: {
      value: 3231343254,
      tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
      tokenSymbol: 'OCEAN'
    }
  },
  purgatory: {
    state: false,
    reason: ''
  }
}
