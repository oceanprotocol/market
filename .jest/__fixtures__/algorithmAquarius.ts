import { Asset } from '@oceanprotocol/lib'

export const algorithmAquarius: Asset = {
  '@context': ['https://w3id.org/did/v1'],
  id: 'did:op:c0598d6d7437cc1bb9eb9d7d0d68de74e3e9809a85818812a91fd424b44d32f7',
  nftAddress: '0x0bfF44972204a23Cf7872A77869216F652d7cBe7',
  version: '4.1.0',
  chainId: 1,
  metadata: {
    created: '2022-11-07T13:56:13Z',
    updated: '2022-11-07T13:56:13Z',
    type: 'algorithm',
    name: 'Python Strategy #1',
    description: 'Written in Python language, this strategy remove noise.',
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
    author: 'Jelly McFish',
    license: 'https://market.oceanprotocol.com/terms',
    additionalInformation: {
      termsAndConditions: true
    },
    algorithm: {
      language: 'py',
      version: '0.1',
      container: {
        entrypoint: 'python $ALGO',
        image: 'python',
        tag: 'latest',
        checksum:
          'sha256:c43926b6865b221fb6460da1e7e19de3143072fc6be8b64cb1e679f90c7fcaa3'
      }
    }
  },
  services: [
    {
      id: '2f3773cc72fc6e6ff595bc6a619aed98cce04b75fc091d5d9910d5d81302ead2',
      type: 'access',
      files:
        '0x04065e6bccf4683faaa946f3aa5a913cf78b9ef8e83949dbfef2e3a912419184050e2b850d0d772478653ee39c21e04c6cb567c62057ec4118701fec1373f140acfdb12b2f5d0461f1450e01a75daeceb8f511aeefb5465c67d2308ec9a3547ca6bb3c34f518ec5ffe12d476004b51bbe2a27079e5660ecc01a0e32509000751815e8b47b7655b1400e231b10865b63fbb0e24b151176186db8b4a0b573337eb21a1647a6dab8618aeb9d2e4ddd4df6f9f21c635e0e2446cffa6a5f7c181833f3154ca67f820313857519f9db42b7606022a685337a8567dca0c260fb24170a398eba029f9a0f8d0246113a059b0f4436642c1469e0b1bcff1a3efb7d2b7a1d36383f407131c58dc7cd960998b89c1e4cc03afb0f44334a9b4dad2dc5cb1ed8005858969cf5bdf92fa94a9e5b453660a31f77fb6e75990b9b5f96b8bb56e89f490e4e3fbdd4f806a9348bef816a88d179d08f00c6898935321f9bb97c9bd6408b04bc1ab2aee81c188d90b3b285f905003c76c2e1f52',
      datatokenAddress: '0x7eeB3B2d3462E4B634AB7b1bB38B7e552271F319',
      serviceEndpoint: 'https://v4.provider.mainnet.oceanprotocol.com',
      timeout: 0
    }
  ],
  event: {
    tx: '0xdcb7e866514da4e8a5b07d3c454ee68b1caf783d13ee17142d61e39726d7c9eb',
    block: 15922373,
    from: '0x0F84452C0DCda0c9980A0a802eb8b8DBAaF52c54',
    contract: '0x0bfF44972204a23Cf7872A77869216F652d7cBe7',
    datetime: '2022-11-08T02:37:47'
  },
  nft: {
    address: '0x0bfF44972204a23Cf7872A77869216F652d7cBe7',
    name: 'Ocean Data NFT',
    symbol: 'OCEAN-NFT',
    state: 0,
    tokenURI:
      'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDpjMDU5OGQ2ZDc0MzdjYzFiYjllYjlkN2QwZDY4ZGU3NGUzZTk4MDlhODU4MTg4MTJhOTFmZDQyNGI0NGQzMmY3IiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOmMwNTk4ZDZkNzQzN2NjMWJiOWViOWQ3ZDBkNjhkZTc0ZTNlOTgwOWE4NTgxODgxMmE5MWZkNDI0YjQ0ZDMyZjciLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDI3QzYsMjYgMTMsMjYgMjEsMjZDMjgsMjUgMzcsMjUgNDYsMjdDNTQsMjggNjIsMzAgNzEsMjlDNzksMjcgODksMjMgOTksMjBMOTksOTlaJy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmJiJyBkPSdNMCw5OUwwLDQ2QzgsNDcgMTYsNDggMjQsNTBDMzEsNTEgMzksNTEgNDcsNTFDNTQsNTAgNjMsNDggNzIsNDdDODAsNDUgODksNDMgOTksNDJMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJmZicgZD0nTTAsOTlMMCw3MEM3LDc0IDE1LDc5IDIzLDc5QzMwLDc4IDM3LDczIDQ2LDcyQzU0LDcwIDY1LDcxIDc1LDcxQzg0LDcwIDkxLDY5IDk5LDY5TDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQy9zdmclM0UifQ==',
    owner: '0x0F84452C0DCda0c9980A0a802eb8b8DBAaF52c54',
    created: '2022-11-07T13:56:23'
  },
  purgatory: {
    state: false,
    reason: ''
  },
  datatokens: [
    {
      address: '0x7eeB3B2d3462E4B634AB7b1bB38B7e552271F319',
      name: 'Stupendous JellyFish Token',
      symbol: 'STUSHA-37',
      serviceId:
        '2f3773cc72fc6e6ff595bc6a619aed98cce04b75fc091d5d9910d5d81302ead2'
    }
  ],
  stats: {
    allocated: 0,
    orders: 0,
    price: {
      value: 50,
      tokenAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
      tokenSymbol: 'OCEAN'
    }
  }
}
