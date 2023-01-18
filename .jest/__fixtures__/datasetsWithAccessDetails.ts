// This is a dump of a typical `queryResult.results` response from Aquarius

export const assets: AssetExtended[] = [
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    credentials: {
      allow: [],
      deny: []
    },
    datatokens: [
      {
        address: '0x8f90ABA587aBE691E136D7d1a64762A2FF15bE4D',
        name: 'DATASET_DT1',
        serviceId: '2',
        symbol: 'DATASET_DT1'
      }
    ],
    event: {
      block: 7745556,
      contract: '0xE07B0a3403fAD9568cd970C04C3D08A9c1Ab93d0',
      datetime: '2022-10-10T14:31:24',
      from: '0xe2DD09d719Da89e5a3D0F2549c7E24566e947260',
      tx: '0x6a0d161cffc090fb18e5fc945290052c0d475e6e4115462da115a7bbcb6202b8'
    },
    id: 'did:op:48406caf76d092e08af6703dde5bbab79ed7528939d8bbe733134284faf39075',
    metadata: {
      author: 'Trent',
      created: '2022-09-19T10:55:11Z',
      description: 'Branin dataset',
      license: 'CC0: PublicDomain',
      name: 'Branin dataset',
      type: 'dataset',
      updated: '2022-09-19T10:55:11Z'
    },
    nft: {
      address: '0xE07B0a3403fAD9568cd970C04C3D08A9c1Ab93d0',
      created: '2022-10-10T14:31:24',
      name: 'DATASET_DN1',
      owner: '0xe2DD09d719Da89e5a3D0F2549c7E24566e947260',
      state: 0,
      symbol: 'DATASET_DN1',
      tokenURI: 'https://oceanprotocol.com/nft/'
    },
    nftAddress: '0xE07B0a3403fAD9568cd970C04C3D08A9c1Ab93d0',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        compute: {
          allowNetworkAccess: true,
          allowRawAlgorithm: false,
          publisherTrustedAlgorithmPublishers: [],
          publisherTrustedAlgorithms: []
        },
        datatokenAddress: '0x8f90ABA587aBE691E136D7d1a64762A2FF15bE4D',
        description: 'Compute service',
        files:
          '0x0405a4c9efd6ed507c40387ffebe4093c901e003f1c6ec57c8a4d2b1c28382743bd2097dfc551ba8972992f9b45ea2046d7d53312d97f92dc7c49dec2769e4d8948f7a2b6df437c93229aa4dea7a636af1aec00dcfc8693040f645880e01a428f3ce7e267eaa49dbefce4de47adcab4abc92f062e0ea19ceff2664071710e42f293aaa96d4c0ff1cccb13cdbaa206a705344954ccf1967e58a3586b4953a1e616df86b565bc837fac2f5aa865617a108c737d9be14b19f98fa6204c8c06f284f52cdf4151b987cfa463350fd8f99019a610cd61fa7463b0e77ba93bd42239b999b86eef475a6c97e295a8e0332a843ad4be9254078d70d6c6e4a11f28bc7e61f5a44f9c68d2268b5b8e4f3908c57a41b0ab6ea78163e0b14076f59212a6b37b43811f20a3afc84c67acaa6d1075b06a6cba9f3d778badab3e97b7b21907ee718374819a68c5b8768fc70dd9194c8f309a48bea17178902532273',
        id: '2',
        name: 'Compute service',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 2592000,
        type: 'compute'
      }
    ],
    stats: {
      allocated: 0,
      orders: 0,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      type: 'NOT_SUPPORTED'
    } as any
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 137,
    datatokens: [
      {
        address: '0xE5E5056A988EAE27f1624CF1212895f5B01D487b',
        name: 'Limpid Ray Token',
        serviceId:
          '52ce21def42afaef2b51e90389355e13bd93e502147172b22051f16f74af163d',
        symbol: 'LIMRAY-96'
      }
    ],
    event: {
      block: 34021412,
      contract: '0x866e4ED7b001f40c4067d0a37d6d401a0B13EfD6',
      datetime: '2022-10-06T23:06:11',
      from: '0x58754d9b3dbB4ddF5AC3502AcB963743b15e6398',
      tx: '0x8af31b8dae91094f0d559fa13c51b7fcb278f9cb8525c2e7badabacf77989a7a'
    },
    id: 'did:op:dabbcf352e9d90d4e4f44a50440b0798a1a1d90e762ab2c7edba6ab4f2129deb',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'MG_DAO',
      created: '2022-10-06T23:05:51Z',
      description:
        "General Info:\n-------------\nThis dataset curated by the MGH DAO contains key stats about the Sandbox, Decentraland and Axie LANDs NFTs.\n \n__After clicking download, open the .txt file and access all the datasets we have created so far. We update the dataset on a daily basis and store a snapshot of the dataset once per week.__\n \n \nThe data is taken from Etherscan and Opensea and fed to a machine learning algorithm that is trained using past price movements and is retrained on a regular basis to keep the accuracy of the price predictions high.\nThe core of the dataset are the aforementioned price predictions for each land that has enough trading history to compute a reasonable prediction.\n \nThe dataset contains two types of data:\n--------\n* Aggregated data retrieved from Opensea and Etherscan\n \n* Processed data from a machine learning algorithm\n \nThe aggregated data is divided into data for every token id and for the whole NFT collection. It includes variables such as tokenid, LAND coordinates, ask, bid, floor, average, max price, suggested operation, and\nkey volume stats.\n \nThe processed data contains two main variables: A predicted price and a price manipulation index for every token id\n \nEvery dataset is divided in two sheets: A Land Valuation and a Global Stats sheet\n \n \nThe dataset is provided by the MGH DAO and it will be continuously improved. If you have feedback or some suggestions on which data should be added, don't hesitate to write us an email to: info@thedac.info\n \nAbout MetaGameHub\n-----------------------\n \nThe MetaGameHub DAO focuses on the convergence of DeFi, Data and the Metaverse. The MGH DAO is a decentralized state within the open metaverse, where its community members collaboratively decide which LANDs to acquire, how to develop them and monetize them through, lending, renting, advertising and the creation of in-house play-to-earn experiences. MetaGameHub adds value to the metaverse ecosystem by providing valuation tools for virtual LANDs, SDKs (Software Development Kits) for metaverse development, oracle nodes for on-chain LAND pricing, and datasets portraying valuable virtual real estate pricing data. MGH wants to improve the infrastructure and transparency of the virtual real estate market while letting its users navigate through the metaverse in a seamless way.\n\n [Twitter](https://twitter.com/MGH_DAO) |  [Telegram](https://t.me/metagamehub_dao)  |  [Website](https://www.metagamehub.io/) |  [Discord](https://discord.gg/uG5XaP6ms3)",
      license: 'https://market.oceanprotocol.com/terms',
      links: [
        'https://docs.google.com/spreadsheets/d/1KA7eaoTQshOTbPqnkoJ-ePvlw6z95zGI1iT7BtzX7nI/edit?usp=sharing'
      ],
      name: 'The Metaverse LAND Dataset',
      tags: [
        'metaverse',
        'ai',
        'dao',
        'the-sandbox',
        'decentraland',
        'axie',
        'virtual-real-estate',
        'nft'
      ],
      type: 'dataset',
      updated: '2022-10-06T23:05:51Z'
    },
    nft: {
      address: '0x866e4ED7b001f40c4067d0a37d6d401a0B13EfD6',
      created: '2022-10-06T23:06:11',
      name: 'Ocean Data NFT',
      owner: '0x58754d9b3dbB4ddF5AC3502AcB963743b15e6398',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDpkYWJiY2YzNTJlOWQ5MGQ0ZTRmNDRhNTA0NDBiMDc5OGExYTFkOTBlNzYyYWIyYzdlZGJhNmFiNGYyMTI5ZGViIiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOmRhYmJjZjM1MmU5ZDkwZDRlNGY0NGE1MDQ0MGIwNzk4YTFhMWQ5MGU3NjJhYjJjN2VkYmE2YWI0ZjIxMjlkZWIiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDIyQzExLDE5IDIzLDE3IDM1LDIwQzQ2LDIyIDU5LDI5IDcwLDMyQzgwLDM0IDg5LDMyIDk5LDMwTDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw0NEMxMiw0NyAyNSw1MSAzNiw1MUM0Niw1MCA1NCw0NCA2NSw0MkM3NSwzOSA4Nyw0MCA5OSw0Mkw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmZmJyBkPSdNMCw5OUwwLDY4QzksNjYgMTgsNjUgMzEsNjlDNDMsNzIgNTgsNzkgNzAsODBDODEsODAgOTAsNzQgOTksNjhMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDL3N2ZyUzRSJ9'
    },
    nftAddress: '0x866e4ED7b001f40c4067d0a37d6d401a0B13EfD6',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0xE5E5056A988EAE27f1624CF1212895f5B01D487b',
        files:
          '0x044412f77fcd2d53dc6243c921c307c38d0c6cd80a7e230bf7251ce38f444b309398aba1380884026efb87c4429eddd555872a495810e9aa3750054bef0a6e043cf630a80867934a7fd978306dff8e54ca8e8d17cca08ca7e4f5e50d4b39d0485d8212d12021f8ea5f8b1c21d791cb7239dc607cfb403bdf0108d327b3126c946bc3af5e9403f5d8ac58e91957bfc81e09a6d24c97ced61517768c3d2e5d69a6232c0c9a1f0c85759fdfc891affad883f816f419b103148db9d5cc917e0223b88cbb1c02c3e16ed6f1b24300914df2e86fe87d7b5a3abcf5fcbe34f4ea54e13dc984717465b8714602f7e416d053f0caf1361ddad20ec0fb939b8e914f2d87f42a62ad5256ee5b6704cf8df93bf79a501ea2926063d4e24010e05deda814316c2b004c0f130b2d9d48150b504178810ce34af2c75b76a5aa34a12be013efd5794802704ecf5570b60928f44507041d7c1670f65091c10a15fba1aea3010de62574cfaee092dfc37135a577abf2b551cf728922fd42ba5cca7e',
        id: '52ce21def42afaef2b51e90389355e13bd93e502147172b22051f16f74af163d',
        serviceEndpoint: 'https://v4.provider.polygon.oceanprotocol.com',
        timeout: 604800,
        type: 'access'
      }
    ],
    stats: {
      allocated: 45554.69921875,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0x403f7f69caa8c0db7cd2f14d8f90b488ec7e70e83ff1c30d7bbdcd9d3605c529',
      price: '100',
      isPurchasable: true,
      baseToken: {
        address: '0x282d8efce846a88b159800bd4130ad77443fa1a1',
        name: 'Ocean Token (PoS)',
        symbol: 'mOCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0xe5e5056a988eae27f1624cf1212895f5b01d487b',
        name: 'Limpid Ray Token',
        symbol: 'LIMRAY-96'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0x57201e593912f4abBB62fEaa4479598c3Ad0010B',
        name: 'Delighted Anchovy Token',
        serviceId:
          '9325f8ff50ff3a46f757e7d819379b4d69fc73e4496880210c8fef8e587addbe',
        symbol: 'DELANC-21'
      }
    ],
    event: {
      block: 7724118,
      contract: '0xca3cCFc6CEcf459200AADA1d4a51024F0EAAC230',
      datetime: '2022-10-06T21:31:12',
      from: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      tx: '0x59b3cda87fe2c1c88ee1f253f2ebe2f089b7987791357247bb4af8f96200c119'
    },
    id: 'did:op:fcfaffeab039fd4406b4546dab57a0380d971f6a2746f588bbeafeb38fc406c9',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author:
        'Anna Padée, Pascal Missonnier, Anne Prévot, Grégoire Favre, Isabelle Gothuey, Marco Merlo, Jonas Richiardi',
      created: '2022-10-06T21:31:05Z',
      description:
        'This is a schizophrenia in ultimatum game task study for Fribourg University. Participants were asked to play the UG in both roles, both as responder and proposer. 128 electrode EEG was recorded during the task. 19 patients with psychosis episodes and 24 healthy controls were recorded during the task.\n\nThis dataset was recorded at the Fribourg University in Switzerland. The project was approved by the Ethics Committee of the University of Fribourg (reference number: 054/13-CER-FR).\n\nParticipants sat in a shielded room, in a comfortable chair and played the game, while EEG was recorded.\n\nFor each role, participants performed three blocks, consisting of 30 repetitions each.',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Fribourg Ultimatum Game in Schizophrenia Study (EEG)',
      tags: ['eeg', 'schizophrenia', 'psychosis'],
      type: 'dataset',
      updated: '2022-10-06T21:31:05Z'
    },
    nft: {
      address: '0xca3cCFc6CEcf459200AADA1d4a51024F0EAAC230',
      created: '2022-10-06T21:31:12',
      name: 'Ocean Data NFT',
      owner: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBOZXVyYURBTyBNYXJrZXRwbGFjZTogaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOmZjZmFmZmVhYjAzOWZkNDQwNmI0NTQ2ZGFiNTdhMDM4MGQ5NzFmNmEyNzQ2ZjU4OGJiZWFmZWIzOGZjNDA2YzkiLCJleHRlcm5hbF91cmwiOiJodHRwczovL21hcmtldC5vY2VhbnByb3RvY29sLmNvbS9hc3NldC9kaWQ6b3A6ZmNmYWZmZWFiMDM5ZmQ0NDA2YjQ1NDZkYWI1N2EwMzgwZDk3MWY2YTI3NDZmNTg4YmJlYWZlYjM4ZmM0MDZjOSIsImJhY2tncm91bmRfY29sb3IiOiIxNDE0MTQiLCJpbWFnZV9kYXRhIjoiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB2aWV3Qm94PScwIDAgOTkgOTknIGZpbGw9J3VuZGVmaW5lZCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyNzcnIGQ9J00wLDk5TDAsMjVDNywyNyAxNSwyOSAyMywyN0MzMCwyNCAzNywxNyA0NywxOEM1NiwxOCA2NywyNCA3NiwyN0M4NCwyOSA5MSwyNiA5OSwyNEw5OSw5OVonLyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyYmInIGQ9J00wLDk5TDAsNDhDOCw0OCAxNyw0OSAyNiw1MUMzNCw1MiA0Miw1NSA1MCw1NkM1Nyw1NiA2Myw1NCA3Miw1NEM4MCw1MyA4OSw1MyA5OSw1M0w5OSw5OVonJTNFJTNDL3BhdGglM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmZmJyBkPSdNMCw5OUwwLDcxQzksNzMgMTgsNzUgMjcsNzdDMzUsNzggNDMsODAgNTEsODBDNTgsNzkgNjUsNzcgNzMsNzZDODAsNzQgODksNzMgOTksNzNMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDL3N2ZyUzRSJ9'
    },
    nftAddress: '0xca3cCFc6CEcf459200AADA1d4a51024F0EAAC230',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x57201e593912f4abBB62fEaa4479598c3Ad0010B',
        files:
          '0x043776dfd05df01a140bc2a622625902ce3c50e676801dace92a7a43ea1c35eff5d4970a25b35f4fc13285abe9512d695ad7eceaf3db0b47dbc438566dc165038a5deafb6570f390c4b80afef3d042f57cd3fb664bfc503baf6a772c191dbd458f4ba0d7bd69a738b141d80009b8cb89fcd32c6a90b73a8164445fe34fce90fbc17ca9a6f0f158dd995d1392ad7b821f162eae9b0410bbc452f65b301bb273cf0987e38cf9315ae92af2ed65ac3c0b31e876c2abd7c14b6c7927e85420d62c28ab88b639800d98137d84d8f86f53e43434a322d2db34c175337d57b99015b9fab0be0c026eaa6c334a2d664162ad966cfcdb91cf4aa4499aa4f480a46b2523f83b7c430586f04c89012851b2b0f6e179e95279478d5f12403362e976002257608aa9db50c7673628f1c150b3d1c6f7c660ab3f1851009121003483e4242d6d28563c07b0238e337391ec5cb887000533afda5846e0d9fe5c4b9efd92802409e4f532875dbc14d7dbece876f9d616a11a0ce53c220ba9bda9',
        id: '9325f8ff50ff3a46f757e7d819379b4d69fc73e4496880210c8fef8e587addbe',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 86400,
        type: 'access'
      }
    ],
    stats: {
      allocated: 0,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 2,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0x6f09253bd70ed45e9e5d807e80319b71c0f444a27360cf51be749c520d0bbc9b',
      price: '7',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0x57201e593912f4abbb62feaa4479598c3ad0010b',
        name: 'Delighted Anchovy Token',
        symbol: 'DELANC-21'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0xC48934b7FfE9a061039e8a2a0DAe303D2b1b68AF',
        name: 'Arcadian Shell Token',
        serviceId:
          'f0e61512966f65e3198fc3caecf198a1f20ff3ca781437e15fe9edc7a00745a4',
        symbol: 'ARCSHE-59'
      }
    ],
    event: {
      block: 7724103,
      contract: '0x59E27Aa74275E2373A965C0a9dca8f112b82D785',
      datetime: '2022-10-06T21:27:36',
      from: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      tx: '0xba3eacfddb57f41e383fa3d6b581ebca4a42a4aa1d751e661636f100a4142a23'
    },
    id: 'did:op:16cf424daaa8cf763c0a753c4fe9045981fdc728571b95021514450d2160bbb8',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author:
        'Haxby, J., Gobbini, M., Furey, M., Ishai, A., Schouten, J., and Pietrini, P.',
      created: '2022-10-06T21:25:49Z',
      description:
        'This dataset was gathered between 2017 and 2018 for as part of the "First-in-human evaluation of [ 11 C]PS13, a novel PET radioligand, to quantify cyclooxygenase-1 in the brain". This dataset consists of 17 subjects and their imaging data as a first release. The second release of this dataset will include blood data for each of the the 17 subjects involved in this study.',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Novel PET radioligand, [11C]PS13 Quantifying Cyclooxygenase-1 in the Brain (PET)',
      tags: ['pet', 'radiogland', 'biomarker'],
      type: 'dataset',
      updated: '2022-10-06T21:25:49Z'
    },
    nft: {
      address: '0x59E27Aa74275E2373A965C0a9dca8f112b82D785',
      created: '2022-10-06T21:27:36',
      name: 'Ocean Data NFT',
      owner: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBOZXVyYURBTyBNYXJrZXRwbGFjZTogaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjE2Y2Y0MjRkYWFhOGNmNzYzYzBhNzUzYzRmZTkwNDU5ODFmZGM3Mjg1NzFiOTUwMjE1MTQ0NTBkMjE2MGJiYjgiLCJleHRlcm5hbF91cmwiOiJodHRwczovL21hcmtldC5vY2VhbnByb3RvY29sLmNvbS9hc3NldC9kaWQ6b3A6MTZjZjQyNGRhYWE4Y2Y3NjNjMGE3NTNjNGZlOTA0NTk4MWZkYzcyODU3MWI5NTAyMTUxNDQ1MGQyMTYwYmJiOCIsImJhY2tncm91bmRfY29sb3IiOiIxNDE0MTQiLCJpbWFnZV9kYXRhIjoiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB2aWV3Qm94PScwIDAgOTkgOTknIGZpbGw9J3VuZGVmaW5lZCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyNzcnIGQ9J00wLDk5TDAsMzFDMTIsMjUgMjQsMjAgMzUsMTlDNDUsMTcgNTUsMjAgNjYsMjFDNzYsMjEgODcsMjEgOTksMjFMOTksOTlaJy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmJiJyBkPSdNMCw5OUwwLDQ2QzgsNTAgMTYsNTQgMjksNTRDNDEsNTMgNTYsNDYgNjksNDVDODEsNDMgOTAsNDUgOTksNDhMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJmZicgZD0nTTAsOTlMMCw2N0MxMSw2OSAyMiw3MiAzNCw3M0M0NSw3MyA1Niw3MSA2Nyw3MUM3Nyw3MCA4OCw3MSA5OSw3M0w5OSw5OVonJTNFJTNDL3BhdGglM0UlM0Mvc3ZnJTNFIn0='
    },
    nftAddress: '0x59E27Aa74275E2373A965C0a9dca8f112b82D785',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0xC48934b7FfE9a061039e8a2a0DAe303D2b1b68AF',
        files:
          '0x043e6b925b876905ec72df9e7db50b155b748e6145ca69d27c8c2af814a9e0cd8ade58cbfea27de7d4823ee30c192b0d73260d605f985edf6dfe51c68e8645425d1097d6e204ad3fab1fce3bed78c720df1e875c653b3c0103f8d2e5b1c24946f2c215ad8e365a9b8ff19dd70451540991008447fd103a0b015392675d5e57ddcca093fc5792b45f5ea9f782a94b57f3111e2e5efe2134422985a29387bd8237ad9f5c83630cd2d5afe01a54decf2ce070a446a827e53d015da04ac3d623988ea78a51fd456f5b2ef6049aebdd36065b12bbdbac1879721beaef3ec0e140842299459afc28cb9a1ac805db3cf93849de5d91cff5ab655daf59569621743f5551240b0298d765b3425609e6c864aeace8c91ee40e53e18c30344b901aa8164a975ca0f23e5db8d8a2693ec79f6bfe357cadbe28c3f3023b312161ad32c132d4b867ab51ca8361539c147798ded00845664c2566bf10cfa7ed3afbd91c960ceca43d20611d7d23c1e14816aefe2712052bf2b74fee56efc1f15ab98d8aa6134120651422902d10d5a523ae3a2c6dc9e561',
        id: 'f0e61512966f65e3198fc3caecf198a1f20ff3ca781437e15fe9edc7a00745a4',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 86400,
        type: 'access'
      }
    ],
    stats: {
      allocated: 50.2051887512,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0xcaf28ecd5a5a3674f7f7b2d61d9546fa50d16607d55ba7a8f9a4ac818f35f311',
      price: '10',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0xc48934b7ffe9a061039e8a2a0dae303d2b1b68af',
        name: 'Arcadian Shell Token',
        symbol: 'ARCSHE-59'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0x1FC8dB81E8b68EB1891f83e742377827b56a0663',
        name: 'Querulous Plankton Token',
        serviceId:
          '9a3135912010f6b27a6c1511c0221853136b3cbc1a55c62ce2b147512300402f',
        symbol: 'QUEPLA-8'
      }
    ],
    event: {
      block: 7724073,
      contract: '0x9293919ED1362e6e0572900B2595a2A0bA1cc77C',
      datetime: '2022-10-06T21:20:36',
      from: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      tx: '0x3b4114e150106247ac71ff96c22604993eae1c0c58725eb8df217aaa3d716238'
    },
    id: 'did:op:930b016ea9790156593e016ba2a4fe7a8bd276c8043320f8ba34d9b36395069e',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author:
        'Gaël Varoquaux, Alexandre Gramfort, Fabian Pedregosa, Vincent Michel, Bertrand Thirion, Richardson, Hilary, Lisandrelli, Grace, Riobueno-Naylor, Alexa, Saxe, Rebecca',
      created: '2022-10-06T21:19:37Z',
      description:
        'Brain functional networks and parcels can extracted from resting-state fMRI. For this purpose we use a multi-subject version of sparse dictionary learning and estimate a group-level atlas of brain networks. This can be understand as a variant of ICA based on the assumption of sparsity rather than independence.\n\nExperiment Details\nParticipants watched Disney Pixar’s “Partly Cloudy” while lying in the scanner. There was no task; participants were simply instructed to lie still and watch the movie. The movie began after 10s of rest (black screen; TRs 1-5). The first 10s of the movie are the opening credits (disney castle, pixar logo; TRs 6-10). \n\nIPS = 168 TRs\nTR = 2s\nExperiment length: 5.6 minutes\n\nPixar Movie Reverse Correlation Events\nEvents defined by conducting reverse correlation analysis in two separate adult samples, using the average response in ToM brain regions (ToM events) and in the pain matrix (Pain events). Events listed are those that replicated across the two samples.  Onsets and Durations are noted in TRs (1 TR = 2s); scanner trigger = TR 1.\n\nEvent types: Theory of Mind (ToM), Physical Sensation/Pain (Pain)\nTRs identified by RC analysis, as reported in Richardson et al. 2018\nToM Event Onsets; Durations \n46; 2\n52; 3\n63; 2\n91; 8\n122; 3\n129; 4\n153; 3\n\nPain Event Onsets; Durations\n38; 2\n49; 1\n56; 2\n71; 5\n100; 2\n108; 6\n117; 3\n134; 3\n159; 2\n\n\nTIMING OF EVENTS FOR MODELING (taking into account hemodynamic lag (4s), scanner trigger = 0):\nAll timings assume 10s from trigger until movie begins to play.\n\nIn seconds:\nMental Event Onsets; Durations\n86; 4\n98; 6\n120; 4\n176; 16\n238; 6\n252; 8\n300; 6\n\nPain Event Onsets; Durations\n70; 4\n92; 2\n106; 4\n136; 10\n194; 4\n210; 12\n228; 6\n262; 6\n312; 4\n\nIn TRs when TR=2:\nMental Event Onsets; Durations\n43; 2\n49; 3\n60; 2\n88; 8\n119; 3\n126; 4\n150; 3\n\nPain Event Onsets; Durations\n35; 2\n46; 1\n53; 2\n68; 5\n97; 2\n105; 6\n114; 3\n131; 3\n156; 2',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Probabilistic Atlas of Functional Regions in Movie-Watching ',
      tags: [
        'msdl',
        'probabilistic-atlas',
        'resting-state',
        'fmri',
        'visual-stimuli'
      ],
      type: 'dataset',
      updated: '2022-10-06T21:19:37Z'
    },
    nft: {
      address: '0x9293919ED1362e6e0572900B2595a2A0bA1cc77C',
      created: '2022-10-06T21:20:36',
      name: 'Ocean Data NFT',
      owner: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBOZXVyYURBTyBNYXJrZXRwbGFjZTogaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjkzMGIwMTZlYTk3OTAxNTY1OTNlMDE2YmEyYTRmZTdhOGJkMjc2YzgwNDMzMjBmOGJhMzRkOWIzNjM5NTA2OWUiLCJleHRlcm5hbF91cmwiOiJodHRwczovL21hcmtldC5vY2VhbnByb3RvY29sLmNvbS9hc3NldC9kaWQ6b3A6OTMwYjAxNmVhOTc5MDE1NjU5M2UwMTZiYTJhNGZlN2E4YmQyNzZjODA0MzMyMGY4YmEzNGQ5YjM2Mzk1MDY5ZSIsImJhY2tncm91bmRfY29sb3IiOiIxNDE0MTQiLCJpbWFnZV9kYXRhIjoiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB2aWV3Qm94PScwIDAgOTkgOTknIGZpbGw9J3VuZGVmaW5lZCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyNzcnIGQ9J00wLDk5TDAsMjRDNywyNSAxNSwyNiAyNywyN0MzOCwyNyA1NCwyNiA2NywyNkM3OSwyNSA4OSwyNCA5OSwyNEw5OSw5OVonLyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyYmInIGQ9J00wLDk5TDAsNDFDOSw0NyAxOCw1MyAyOSw1NUM0MCw1NiA1Myw1NCA2NSw1M0M3Nyw1MSA4OCw1MSA5OSw1Mkw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmZmJyBkPSdNMCw5OUwwLDc5QzEzLDc5IDI3LDgwIDM3LDc3QzQ2LDczIDUyLDY2IDYyLDY3QzcxLDY3IDg1LDc0IDk5LDgxTDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQy9zdmclM0UifQ=='
    },
    nftAddress: '0x9293919ED1362e6e0572900B2595a2A0bA1cc77C',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x1FC8dB81E8b68EB1891f83e742377827b56a0663',
        files:
          '0x0421fc24dc6b2bbe70ec05954eeda9e60156fc62e4a90aff80d1bd34ff647324bef394500adc3b202bf4d2a22af48cccd414c599579fb054876ccc631ad4fa39eb76bde29c7bde581b6954334891bffef4c4a9d5e08369ec12b26964a552b9f9d0796f053705a71737f692d74be64fa21db0a06811a6eedc4d7b3a4416cddca0aaacaeda4f327e2e7579bdf40c6b894adb72c33c41d181b52b4100a3381f4b7ae0c83effb9edbf025630a6691804b1911560d6d15934ae5ae79e548e72e325173d0a8c8920981367cf1e7ba9126f5be6a756a5e4508e614ed78a15f97f39c5a317fa65de1e2481d144db2802fcdeff77a1b43db7d6ad45a82d7cf375b629387335495d93b63bb78a45219ba0e9ee7c0ab85713d4bd315ccb46eed6c0a87d45e01a9c4cb278f988e1e05f7b24ab25bc9bca3763457116e0c4c8e7336d5fcbed697aa2ec0c13a224a800bb0ce7693d421ff833',
        id: '9a3135912010f6b27a6c1511c0221853136b3cbc1a55c62ce2b147512300402f',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 86400,
        type: 'access'
      }
    ],
    stats: {
      allocated: 0,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0x938802c3fe89c54a0e6b1cd47fa5263817282185a2e0f78fa2957ec1aff970fc',
      price: '6',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0x1fc8db81e8b68eb1891f83e742377827b56a0663',
        name: 'Querulous Plankton Token',
        symbol: 'QUEPLA-8'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0xb9060a712a494f584b072b0753dc275e1c531178510679ac085053ee38b5f742',
      price: '5',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0x0a9cfaff200efb1d6f125e342dfc78fb3edd28a4',
        name: 'Inspired Ling Token',
        symbol: 'INSLIN-54'
      },
      isOwned: false,
      validOrderTx: null
    },
    chainId: 5,
    datatokens: [
      {
        address: '0x0A9CFaFf200efb1d6F125E342Dfc78Fb3edD28A4',
        name: 'Inspired Ling Token',
        serviceId:
          '383b0e1b8dc3e816af394bfae899eb0c9826f2383602c0fbcd70705e1e9c1302',
        symbol: 'INSLIN-54'
      }
    ],
    event: {
      block: 7723888,
      contract: '0xeB7eC160ce8F73bE2e7d542c2283F1aEa163C07B',
      datetime: '2022-10-06T20:31:36',
      from: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      tx: '0x18b1d0af634fab3196921a99618fd9333c4a2113a016bf4757d609ddfdb64432'
    },
    id: 'did:op:6b4314bd7345d07a10ba2c82a352655273b00cdceb2eedd31c8e0d2b5881eb16',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author:
        'Haxby, J. V., Gobbini, M. I., Furey, M. L., Ishai, A., Schouten, J. L. & Pietrini, P. ',
      created: '2022-10-06T20:30:01Z',
      description:
        'This is a block-design fMRI dataset from a study on face and object representation in human ventral temporal cortex. It consists of 6 subjects with 12 runs per subject. In each run, the subjects passively viewed greyscale images of eight object categories, grouped in 24s blocks separated by rest periods. Each image was shown for 500ms and was followed by a 1500ms inter-stimulus interval. Full-brain fMRI data were recorded with a volume repetition time of 2.5s, thus, a stimulus block was covered by roughly 9 volumes. This dataset has been repeatedly reanalyzed. For a complete description of the experimental design, fMRI acquisition parameters, and previously obtained results see the [references](http://www.pymvpa.org/datadb/haxby2001.html#references) below. \n\n',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Faces and Objects in Ventral Temporal Cortex (fMRI) (Compute) ',
      tags: ['fmri', 'bold', 'visual-stimuli', '4d', 'functional'],
      type: 'dataset',
      updated: '2022-10-06T20:30:01Z'
    },
    nft: {
      address: '0xeB7eC160ce8F73bE2e7d542c2283F1aEa163C07B',
      created: '2022-10-06T20:30:36',
      name: 'Ocean Data NFT',
      owner: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBOZXVyYURBTyBNYXJrZXRwbGFjZTogaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjZiNDMxNGJkNzM0NWQwN2ExMGJhMmM4MmEzNTI2NTUyNzNiMDBjZGNlYjJlZWRkMzFjOGUwZDJiNTg4MWViMTYiLCJleHRlcm5hbF91cmwiOiJodHRwczovL21hcmtldC5vY2VhbnByb3RvY29sLmNvbS9hc3NldC9kaWQ6b3A6NmI0MzE0YmQ3MzQ1ZDA3YTEwYmEyYzgyYTM1MjY1NTI3M2IwMGNkY2ViMmVlZGQzMWM4ZTBkMmI1ODgxZWIxNiIsImJhY2tncm91bmRfY29sb3IiOiIxNDE0MTQiLCJpbWFnZV9kYXRhIjoiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB2aWV3Qm94PScwIDAgOTkgOTknIGZpbGw9J3VuZGVmaW5lZCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyNzcnIGQ9J00wLDk5TDAsMjVDMTIsMjYgMjQsMjcgMzUsMjhDNDUsMjggNTIsMjggNjMsMjhDNzMsMjcgODYsMjYgOTksMjVMOTksOTlaJy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmJiJyBkPSdNMCw5OUwwLDQ4QzExLDQ3IDIzLDQ2IDM0LDQ3QzQ0LDQ3IDU1LDQ4IDY2LDQ5Qzc2LDQ5IDg3LDQ5IDk5LDQ5TDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyZmYnIGQ9J00wLDk5TDAsODBDOCw3NCAxNyw2OCAyOCw3MEMzOCw3MSA1MSw3OSA2NCw4MEM3Niw4MCA4Nyw3NCA5OSw2OUw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0Mvc3ZnJTNFIn0='
    },
    nftAddress: '0xeB7eC160ce8F73bE2e7d542c2283F1aEa163C07B',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        compute: {
          allowNetworkAccess: true,
          allowRawAlgorithm: false,
          publisherTrustedAlgorithmPublishers: [],
          publisherTrustedAlgorithms: [
            {
              containerSectionChecksum:
                '54eb02210bad8a5fbe229e1d131a68e80fe32709a196c6ce49f33e5d378b1195',
              did: 'did:op:f86dedf3c872f79f788627025685a680eaac9f8bd7b6e622164fd8563e21e836',
              filesChecksum:
                '2f8afee0a35fbeb72a447c7d1437b6c83f937e6d65a6c7d1990548cc21ff254c'
            }
          ]
        },
        datatokenAddress: '0x0A9CFaFf200efb1d6F125E342Dfc78Fb3edD28A4',
        files:
          '0x0479c75f624d86700c6b33deb392b2d60bd66a5bd92778851eb124bf3785f270b356ce42a228f5a5eb4dead55fc7892a3f4a9f114dfa5493f480146af72ccdcca5816996b0ff002a69e113509256494d64ad39b86be92c7668baa5060c98f402f60fcf7acd0d25e923cecaa5f483fd14a8568a782023b164f8424a95b43c165e813fd031c7b5887ac467af76d94d2ca8b45e34951694cc60ead2c15137eebc60703b9a12a4a4643ecd343de8d0326abb87e093abacf55ba83c06b2840284e8f17d9c498f02dcfd74239371c25ad0fcac703be994065b7ffa12f3a47ba3d363d31f475e6519e7cc5a65e74cafdf029a1d73a007e886206f4b4e36251721866f399076dd2435c314cdfdc42638a570fe57bb33f2935861c01ec708f80acd738d2a45dd64d374278dc63026ac7f4f8dba979e7cdc4e24e5f39aef4550b1cbf190525bdfa0e30900084aef223863e54bd0866ab958',
        id: '383b0e1b8dc3e816af394bfae899eb0c9826f2383602c0fbcd70705e1e9c1302',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 86400,
        type: 'compute'
      }
    ],
    stats: {
      allocated: 0,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0'
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0x7626dE49a774c18E0f7Fc658821a87E103f80fab',
        name: 'Lovely Prawn Token',
        serviceId:
          'be48353fe208e765c24b0a344c2cc826ff0ea18582a162d67f6ad23078595d59',
        symbol: 'LOVPRA-51'
      }
    ],
    event: {
      block: 7723861,
      contract: '0xACa9d4Df6a4dfF29913A111099bc4aC6363C124F',
      datetime: '2022-10-06T20:24:24',
      from: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      tx: '0xdca6494d123c796443c6ce46bb4c02938526a03f86661941eaddcb76377f5825'
    },
    id: 'did:op:f86dedf3c872f79f788627025685a680eaac9f8bd7b6e622164fd8563e21e836',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      algorithm: {
        container: {
          checksum:
            'sha256:a981ed6282271fc5492c382cd11d5045641880f738c05a855ed6de8d0eecea8f',
          entrypoint: 'python3.8 $ALGO',
          image: 'anmu06/c2d_neuradao',
          tag: 'latest'
        },
        language: 'py',
        version: '0.1'
      },
      author: 'Nilearn ',
      created: '2022-10-06T20:24:15Z',
      description:
        'Plot cuts of an EPI image (by default 3 cuts: Frontal, Axial, and Lateral)\n\nUsing [nilearn.plotting.plot_epi](https://nilearn.github.io/stable/modules/generated/nilearn.plotting.plot_epi.html) to compute and plot EPI. ',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'fMRI Time-Averaged EPI Visualization ',
      tags: ['epi', 'bold', 'fmri'],
      type: 'algorithm',
      updated: '2022-10-06T20:24:15Z'
    },
    nft: {
      address: '0xACa9d4Df6a4dfF29913A111099bc4aC6363C124F',
      created: '2022-10-06T20:24:24',
      name: 'Ocean Data NFT',
      owner: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBOZXVyYURBTyBNYXJrZXRwbGFjZTogaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOmY4NmRlZGYzYzg3MmY3OWY3ODg2MjcwMjU2ODVhNjgwZWFhYzlmOGJkN2I2ZTYyMjE2NGZkODU2M2UyMWU4MzYiLCJleHRlcm5hbF91cmwiOiJodHRwczovL21hcmtldC5vY2VhbnByb3RvY29sLmNvbS9hc3NldC9kaWQ6b3A6Zjg2ZGVkZjNjODcyZjc5Zjc4ODYyNzAyNTY4NWE2ODBlYWFjOWY4YmQ3YjZlNjIyMTY0ZmQ4NTYzZTIxZTgzNiIsImJhY2tncm91bmRfY29sb3IiOiIxNDE0MTQiLCJpbWFnZV9kYXRhIjoiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB2aWV3Qm94PScwIDAgOTkgOTknIGZpbGw9J3VuZGVmaW5lZCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyNzcnIGQ9J00wLDk5TDAsMjVDOCwyNCAxNiwyMyAyNCwyNEMzMSwyNCAzOCwyNyA0NywyOEM1NSwyOCA2NiwyOCA3NSwyOEM4MywyNyA5MSwyNyA5OSwyN0w5OSw5OVonLyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyYmInIGQ9J00wLDk5TDAsNTRDOCw1MiAxNiw1MSAyNSw1MEMzMyw0OCA0MSw0NyA0OSw0NkM1Niw0NCA2NCw0MSA3Myw0M0M4MSw0NCA5MCw0OSA5OSw1NUw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmZmJyBkPSdNMCw5OUwwLDczQzcsNzIgMTUsNzEgMjUsNzBDMzQsNjggNDQsNjcgNTIsNjlDNTksNzAgNjQsNzQgNzIsNzVDNzksNzUgODksNzIgOTksNzBMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDL3N2ZyUzRSJ9'
    },
    nftAddress: '0xACa9d4Df6a4dfF29913A111099bc4aC6363C124F',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        compute: {
          allowNetworkAccess: true,
          allowRawAlgorithm: false,
          publisherTrustedAlgorithmPublishers: [],
          publisherTrustedAlgorithms: []
        },
        datatokenAddress: '0x7626dE49a774c18E0f7Fc658821a87E103f80fab',
        files:
          '0x0498ac38d3ac04dc4f33b5a91358b8e121fa5bc86bcb20b8bc1c27ce1f47db491efda1bf90ab4d4c893a636d570f8fdc29eae7e010f846a34cfc24bc751b64f9d104afcc7f22c82a8cffb412886ba9649b73c2b6fe95e5fab0882bc8174823db08af64c14177bfafad0fc43bb9c9db95df61dabeb0ac1fbb27c07d3705cdf6f8fdd5cb37fc2c50ae0db6bf778b7f9f5475ce1730edacd8e48aa99548184ece9df8fabca2bd7535caf9107b3312f15aaaf6bbc2143782824aac54a04a5136bd1af2121b579b8eaa71abccff4bc4147b592e2b7b7a6d928870861996e67b69277ef60128d7cf86ce5abbf860194ab5ebd8dcbc2a29fbddf5f2482510736de7e9427b4f61306df121a1bd757f0c7d0ae7c702bdff2c85f9b9c7956ced9561693da910ac211e3f35a295981a443695be9e8854554c87fd4747a709a3e43a220e380b4c36f4de92f4b0e2a6301b33c9b22356de1fec345b268e632673e3c70bc5eb',
        id: 'be48353fe208e765c24b0a344c2cc826ff0ea18582a162d67f6ad23078595d59',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 0,
        type: 'compute'
      }
    ],
    stats: {
      allocated: 0,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0x1c4f156e06d1b9eeb5aa367869c9d14386918aa12ef4969c3bf242ef6bcba7c8',
      price: '5',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0x7626de49a774c18e0f7fc658821a87e103f80fab',
        name: 'Lovely Prawn Token',
        symbol: 'LOVPRA-51'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0x40C929B5265F13E668A3e81c4289A279bd2f7452',
        name: 'Fecund Anchovy Token',
        serviceId:
          '440cdd2f76cd72803ca478fd432d087d6213711ac35163591afe22bbc77a0154',
        symbol: 'FECANC-54'
      }
    ],
    event: {
      block: 7723800,
      contract: '0x9C725CADD67f67B5F755a30879945c3ECF6aAA46',
      datetime: '2022-10-06T20:10:12',
      from: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      tx: '0x5ea85c7bc0998a42896a7011d0595f01159647399e1fd008353ac9bb95339a25'
    },
    id: 'did:op:2f9cf3eba8ff21db32350aa6d48db89ca86beab7adf729a40a5debdcef8cd7cb',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author:
        'Haxby, J. V., Gobbini, M. I., Furey, M. L., Ishai, A., Schouten, J. L. & Pietrini, P.',
      created: '2022-10-06T20:09:49Z',
      description:
        'This is a block-design fMRI dataset from a study on face and object representation in human ventral temporal cortex. It consists of 6 subjects with 12 runs per subject. In each run, the subjects passively viewed greyscale images of eight object categories, grouped in 24s blocks separated by rest periods. Each image was shown for 500ms and was followed by a 1500ms inter-stimulus interval. Full-brain fMRI data were recorded with a volume repetition time of 2.5s, thus, a stimulus block was covered by roughly 9 volumes. This dataset has been repeatedly reanalyzed. For a complete description of the experimental design, fMRI acquisition parameters, and previously obtained results see the [references](http://www.pymvpa.org/datadb/haxby2001.html#references) below.\n\n',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Faces and Objects in Ventral Temporal Cortex (fMRI)',
      tags: ['fmri', 'bold', '4d', 'functional', 'visual-stimuli'],
      type: 'dataset',
      updated: '2022-10-06T20:09:49Z'
    },
    nft: {
      address: '0x9C725CADD67f67B5F755a30879945c3ECF6aAA46',
      created: '2022-10-06T20:10:12',
      name: 'Ocean Data NFT',
      owner: '0x7E0ad0B2CD0560Caf9a4Fc25904d2AB7238d140b',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBOZXVyYURBTyBNYXJrZXRwbGFjZTogaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjJmOWNmM2ViYThmZjIxZGIzMjM1MGFhNmQ0OGRiODljYTg2YmVhYjdhZGY3MjlhNDBhNWRlYmRjZWY4Y2Q3Y2IiLCJleHRlcm5hbF91cmwiOiJodHRwczovL21hcmtldC5vY2VhbnByb3RvY29sLmNvbS9hc3NldC9kaWQ6b3A6MmY5Y2YzZWJhOGZmMjFkYjMyMzUwYWE2ZDQ4ZGI4OWNhODZiZWFiN2FkZjcyOWE0MGE1ZGViZGNlZjhjZDdjYiIsImJhY2tncm91bmRfY29sb3IiOiIxNDE0MTQiLCJpbWFnZV9kYXRhIjoiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB2aWV3Qm94PScwIDAgOTkgOTknIGZpbGw9J3VuZGVmaW5lZCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyNzcnIGQ9J00wLDk5TDAsMjRDOSwyNSAxOCwyNyAyOSwyOEMzOSwyOCA1MSwyOCA2MywyOEM3NCwyNyA4NiwyNyA5OSwyOEw5OSw5OVonLyUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyYmInIGQ9J00wLDk5TDAsNDlDMTIsNDcgMjUsNDUgMzUsNDVDNDQsNDQgNTEsNDQgNjIsNDVDNzIsNDUgODUsNDcgOTksNTBMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJmZicgZD0nTTAsOTlMMCw3NEMxMSw3NCAyMyw3NSAzNCw3NkM0NCw3NiA1Myw3OCA2NCw3OEM3NCw3NyA4Niw3NSA5OSw3NEw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0Mvc3ZnJTNFIn0='
    },
    nftAddress: '0x9C725CADD67f67B5F755a30879945c3ECF6aAA46',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x40C929B5265F13E668A3e81c4289A279bd2f7452',
        files:
          '0x04766f8cb6306eed4cd0fb6938c68a946a2f299525890afac89fab0e3e697748961e5072136e0ae57f20a7b6a6bc8ef12760b2c774e7feea28dcc099c7d52b77201a1f57b0e0d345ec0b51b5beb13af6c2a2a72ab5fb610de8a194f6fa0ef7f0fd84b0b868ed63ff820813c72c6d228fc093e299490a2f8a95cbd43f69e0bcdba524457191f812977ce6239db432641c13442caac3594d962fd3410bd829aea7cc82483473f42417922b12c9f8871a60be7d33ebc5bed37d2416defb59dbd3b63330ab33acea402f1d09145f05504d031cdc53c0120ce5704bad4721af2f71175ac19c7d3d0cde0830d9f59c90a0e8b94e162b025f86171e6145486afeb06b5409ff1e867f32c9191bf7063180f9d883e9fa7d64acb30bd3c5f6cb43c8249ed740859955a6f9036130b2c0832d433f58bfde1267c883c98065168080bba055a4f1d4e394b80f606f81792ef1b8815fdc1184f6',
        id: '440cdd2f76cd72803ca478fd432d087d6213711ac35163591afe22bbc77a0154',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 0,
        type: 'access'
      }
    ],
    stats: {
      allocated: 0,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0xe6665bd4541c6584a3e31dbf73a74e91da6c791954ea3d61905e50b6e00e0b4e',
      price: '5',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0x40c929b5265f13e668a3e81c4289a279bd2f7452',
        name: 'Fecund Anchovy Token',
        symbol: 'FECANC-54'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 137,
    datatokens: [
      {
        address: '0x0A81F1c69e5428067e6124817C7AFFE8bC0adF9f',
        name: 'Fabulous Walrus Token',
        serviceId:
          '485bd67a4bdb69353b4500bb194c6a20c6be57337956cf2f699f3530847ef038',
        symbol: 'FABWAL-60'
      }
    ],
    event: {
      block: 34000873,
      contract: '0x5f7D840050e008F91f9Fd3dba5fE0f91BbE4b14F',
      datetime: '2022-10-06T11:16:48',
      from: '0xF5dcd98a1C99c2c65C62025Cb23cFB6f12F35497',
      tx: '0x8713e0f444dee5a79799d3037047a3463199164232250b056f8723b2402ea320'
    },
    id: 'did:op:1ea697b447f0a0b3209048f144c0331ca1a8c10af27e233512a41623b93ff8ed',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'OPF',
      created: '2022-10-06T11:16:17Z',
      description:
        'Test asset wrt issue https://github.com/oceanprotocol/ocean.py/issues/990\n\nUrl is https://cexa.oceanprotocol.io/ohlc?exchange=binance&pair=ETH/USDT',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'CEXA test ocean.py#990 (4)',
      tags: ['defi'],
      type: 'dataset',
      updated: '2022-10-06T11:16:17Z'
    },
    nft: {
      address: '0x5f7D840050e008F91f9Fd3dba5fE0f91BbE4b14F',
      created: '2022-10-06T11:16:48',
      name: 'Ocean Data NFT',
      owner: '0xF5dcd98a1C99c2c65C62025Cb23cFB6f12F35497',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDoxZWE2OTdiNDQ3ZjBhMGIzMjA5MDQ4ZjE0NGMwMzMxY2ExYThjMTBhZjI3ZTIzMzUxMmE0MTYyM2I5M2ZmOGVkIiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjFlYTY5N2I0NDdmMGEwYjMyMDkwNDhmMTQ0YzAzMzFjYTFhOGMxMGFmMjdlMjMzNTEyYTQxNjIzYjkzZmY4ZWQiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDI4QzEwLDI0IDIwLDIxIDI3LDIxQzMzLDIwIDM3LDIyIDQ2LDI0QzU0LDI1IDY2LDI3IDc2LDI4Qzg1LDI4IDkyLDI3IDk5LDI2TDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw1NkM4LDU1IDE3LDU0IDI1LDUxQzMyLDQ3IDQwLDQwIDQ5LDQyQzU3LDQzIDY4LDUyIDc3LDU0Qzg1LDU1IDkyLDUwIDk5LDQ2TDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyZmYnIGQ9J00wLDk5TDAsNzdDNiw3OCAxMyw4MCAyMSw4MEMyOCw3OSAzNyw3NiA0Niw3NUM1NCw3MyA2NCw3MSA3Myw3MkM4MSw3MiA5MCw3NCA5OSw3Nkw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0Mvc3ZnJTNFIn0='
    },
    nftAddress: '0x5f7D840050e008F91f9Fd3dba5fE0f91BbE4b14F',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x0A81F1c69e5428067e6124817C7AFFE8bC0adF9f',
        files:
          '0x04c5f0ebee297a2121d3f37e46d93ac2c0fc5d642e4c4c4eae152754047ae4b10e0445b4e908166a47c3e98b636cbf9791d0ee1caf37d6f6fa7da539abc52df7e2d55b2b33b0378a38dbaf3e489b830d57e8db8dbc6deff94476eda055f0a5152869e8cee2eae42692070f98aa9b99025a1a4887e84f34176a27b65e6cec455ba60e6628e496c91bd1b222612ed1f530a3976f0fe5ae55afad194fa947fef19b97522ca45c6268afff22d610d1fd6f11d10f02fb42d66d566fca66544537feb717d6c8d6281408c9d4e29905bdac106e7f94750631082fcae42929b3a389d298fac48513397a8e3c235a81acd9675e92dd776f37a762d7a1b706abf26a46e571e9513c4ee9119a8f60d51995fcdcc76a9e048d16bae1e4cfe50824f9b71104e5485b1ef784e95195d3bbed2b604fc24c8f8f4e780e1837aac1cc0194b2db1b91a56671b998f32ffba6d43482cc6cc6e33c1296865d1f4fbe',
        id: '485bd67a4bdb69353b4500bb194c6a20c6be57337956cf2f699f3530847ef038',
        serviceEndpoint: 'https://v4.provider.polygon.oceanprotocol.com',
        timeout: 604800,
        type: 'access'
      }
    ],
    stats: {
      allocated: 114.1658859253,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'free',
      addressOrId: '0x0a81f1c69e5428067e6124817c7affe8bc0adf9f',
      price: '0',
      isPurchasable: true,
      datatoken: {
        address: '0x0a81f1c69e5428067e6124817c7affe8bc0adf9f',
        name: 'Fabulous Walrus Token',
        symbol: 'FABWAL-60'
      },
      baseToken: null,
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0xbadac447bF4868aeCa6A9c7448DDAdfe6632509a',
        name: 'Tactful Shark Token',
        serviceId:
          'c02b30d8930ac5d2561d4c391c74c06a39d6060802be2534218bd3449d9387ce',
        symbol: 'TACSHA-14'
      }
    ],
    event: {
      block: 7717509,
      contract: '0x4eF0395f0319E6d919942ea3a98472cf957967Da',
      datetime: '2022-10-05T18:25:48',
      from: '0x26D9690eD920682FbC4f3A05e480B8c6ff978ca8',
      tx: '0xe3e87b83e0f687dceb8db1eb4d3b8053522a6b722e376e472e71e337ad64c0a2'
    },
    id: 'did:op:d1563919dd61c8ea5790b85f3a569fa69e46c84a600290ca377a1cb009bb7694',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'aaa',
      created: '2022-10-05T18:25:38Z',
      description: 'Template template moneeey',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Template template moneeey',
      tags: [],
      type: 'dataset',
      updated: '2022-10-05T18:25:38Z'
    },
    nft: {
      address: '0x4eF0395f0319E6d919942ea3a98472cf957967Da',
      created: '2022-10-05T18:25:48',
      name: 'Ocean Data NFT',
      owner: '0x26D9690eD920682FbC4f3A05e480B8c6ff978ca8',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDpkMTU2MzkxOWRkNjFjOGVhNTc5MGI4NWYzYTU2OWZhNjllNDZjODRhNjAwMjkwY2EzNzdhMWNiMDA5YmI3Njk0IiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOmQxNTYzOTE5ZGQ2MWM4ZWE1NzkwYjg1ZjNhNTY5ZmE2OWU0NmM4NGE2MDAyOTBjYTM3N2ExY2IwMDliYjc2OTQiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDI5QzUsMjkgMTEsMjkgMjAsMzBDMjgsMzAgMzgsMzEgNDgsMjlDNTcsMjYgNjUsMjEgNzQsMjBDODIsMTggOTAsMTkgOTksMjBMOTksOTlaJy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmJiJyBkPSdNMCw5OUwwLDU3QzksNTcgMTgsNTggMjYsNTVDMzMsNTEgMzksNDIgNDcsNDJDNTQsNDEgNjQsNTAgNzQsNTNDODMsNTUgOTEsNTEgOTksNDdMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJmZicgZD0nTTAsOTlMMCw3NEMxMCw3MiAyMCw3MCAyOCw2OUMzNSw2NyAzOCw2NiA0Niw3MEM1Myw3MyA2NCw3OSA3NCw4MEM4Myw4MCA5MSw3MyA5OSw2N0w5OSw5OVonJTNFJTNDL3BhdGglM0UlM0Mvc3ZnJTNFIn0='
    },
    nftAddress: '0x4eF0395f0319E6d919942ea3a98472cf957967Da',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0xbadac447bF4868aeCa6A9c7448DDAdfe6632509a',
        files:
          '0x048db0b48ee8f19f3e163cef39095799876e84ad5a2dd3e5140b2ed0f33f13351d078b07b5e1d38f2427ff0a2a21a24dc0f02756bb51603b384adc83b936621a8861fd5e56d9d51122f391cf1f823ae417a56dc8a0f3f26e85eafad124500175be7c732aec90cc5cc88c83378e3a503334f0e0589ca0f48328bda961dcf26dae6ea209143918f201a81be982bbcfd0294f7d97a4d54e7982b995c4329c5d3c29e084c4d4aaeeeccc9b70f353de7fdc38a70dbcbd0425d9c696e8fefa9ea7a3d4aa4f28c8dcba7536e7afc5aa8d64c5b9b949657aed2249440a80f46b2b84317530a35888ccbc259de8a4c77f91c25d0c507b67e7998143b0e9b0068b72f93a2195a1c5b9260684fa554bdd15721a34cad1308c45483ab935ba9ac1f391b89f10158fb39b712af5f37d135591c21a',
        id: 'c02b30d8930ac5d2561d4c391c74c06a39d6060802be2534218bd3449d9387ce',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 0,
        type: 'access'
      }
    ],
    stats: {
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 1,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0xdbfa14546d4f2caa1e0d59cbf8ae775c65b0d34369f8c62990c0b0d0bc73ff10',
      price: '2',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0xbadac447bf4868aeca6a9c7448ddadfe6632509a',
        name: 'Tactful Shark Token',
        symbol: 'TACSHA-14'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0x772224c2C2bddb88A55b3905aAaf8C7188b02ce3',
        name: 'Rebarbative Barnacle Token',
        serviceId:
          '42e244808872c9f4ad96db99d9877abbf3cae9988dec9bd52ab2e336d7ac83af',
        symbol: 'REBBAR-99'
      }
    ],
    event: {
      block: 7717490,
      contract: '0xf919A3b0D1538CAA24Efe2BeaAbe43F776aE83ED',
      datetime: '2022-10-05T18:21:24',
      from: '0x26D9690eD920682FbC4f3A05e480B8c6ff978ca8',
      tx: '0xa38677962c1c83faad8365fbd924b3ca35fb2c0f07af504d7438eec6e54c9918'
    },
    id: 'did:op:aeb9faad199e79eb21cddc15557fa42fe95a02e03c493be8e849594aae60221a',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'aaaa',
      created: '2022-10-05T18:21:13Z',
      description: 'Template template ',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Template template ',
      tags: ['aaa'],
      type: 'dataset',
      updated: '2022-10-05T18:21:13Z'
    },
    nft: {
      address: '0xf919A3b0D1538CAA24Efe2BeaAbe43F776aE83ED',
      created: '2022-10-05T18:21:24',
      name: 'Ocean Data NFT',
      owner: '0x26D9690eD920682FbC4f3A05e480B8c6ff978ca8',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDphZWI5ZmFhZDE5OWU3OWViMjFjZGRjMTU1NTdmYTQyZmU5NWEwMmUwM2M0OTNiZThlODQ5NTk0YWFlNjAyMjFhIiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOmFlYjlmYWFkMTk5ZTc5ZWIyMWNkZGMxNTU1N2ZhNDJmZTk1YTAyZTAzYzQ5M2JlOGU4NDk1OTRhYWU2MDIyMWEiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDE4QzEwLDE3IDIwLDE2IDI4LDE5QzM1LDIxIDM5LDI4IDQ4LDI5QzU2LDI5IDY3LDI0IDc3LDIyQzg2LDE5IDkyLDE4IDk5LDE4TDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw0OEM2LDUwIDEzLDUyIDIzLDU1QzMyLDU3IDQ0LDU4IDUzLDU2QzYxLDUzIDY3LDQ1IDc1LDQzQzgyLDQwIDkwLDQxIDk5LDQzTDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyZmYnIGQ9J00wLDk5TDAsNzVDOSw3NCAxOSw3MyAyOCw3NEMzNiw3NCA0NCw3NSA1Miw3NUM1OSw3NCA2Nyw3MyA3NSw3M0M4Miw3MiA5MCw3MSA5OSw3MUw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0Mvc3ZnJTNFIn0='
    },
    nftAddress: '0xf919A3b0D1538CAA24Efe2BeaAbe43F776aE83ED',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x772224c2C2bddb88A55b3905aAaf8C7188b02ce3',
        files:
          '0x0435d6273c00013a79d50a8b4fd8e65b7ccbde5fcb99726d52fb222282f5e80a18873a27908c5ed07fc808175784b162792c4946a735fbbe338c5ce7579ae46451f88c5eda573ae7c7764337d8d165a0fe715aab96f416c606b84f3b2dba9dbd8d7c00ce8ffe67d644ce88a4c9d842a149a93f3e6135b94b448db76960f5375dc661fb9a75b424d28b43553b58af31b02eab5b1e928f71c699eb9a4114284fe0b9eeeaccb3d02848c16a544160e68b18db5cc214f9d56b6c5aa775853248e5a0164045da6b30ccc7a13a45396bf2cf6bc10d31feb3bb9b2c40b3a6c8c97cde85de13b56d2f2d09aee13180b63423b7d30d4c6fd03d8d5ab15395463038c12b2da1ca86f9317011dc215750dd5c16f4360b658aa39f5e2e93b0ff1de9e7a88c5afb23daa5122160c463b973fb9bf8',
        id: '42e244808872c9f4ad96db99d9877abbf3cae9988dec9bd52ab2e336d7ac83af',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 0,
        type: 'access'
      }
    ],
    stats: {
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 2,
      publisherMarketOrderFee: '0',
      type: 'free',
      addressOrId: '0x772224c2c2bddb88a55b3905aaaf8c7188b02ce3',
      price: '0',
      isPurchasable: true,
      datatoken: {
        address: '0x772224c2c2bddb88a55b3905aaaf8c7188b02ce3',
        name: 'Rebarbative Barnacle Token',
        symbol: 'REBBAR-99'
      },
      baseToken: null,
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 137,
    datatokens: [
      {
        address: '0x89A0170556BB80438081D69F43d8C07a90e9Aa24',
        name: 'Invidious Octopus Token',
        serviceId:
          '8573fbf5e2e5a90631e26bef416f140f815570b5124b8ad52812443d110a57c2',
        symbol: 'INVOCT-85'
      }
    ],
    event: {
      block: 33956932,
      contract: '0x0fb9814D744ed407878D6D7508649b8D43F6b30a',
      datetime: '2022-10-05T09:49:12',
      from: '0xF5dcd98a1C99c2c65C62025Cb23cFB6f12F35497',
      tx: '0xe656b9d934ba1f8c98eb9372fd03709c880486fff0b50476450ef458694b1529'
    },
    id: 'did:op:191af71e271d4eb6f9ac582b2a6a78e8d79167da7a13a30878c7b699842aa421',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'OPF',
      created: '2022-10-05T09:42:06Z',
      description:
        'Test asset wrt issue https://github.com/oceanprotocol/ocean.py/issues/990\n\nUrl is https://cexa.oceanprotocol.io/ohlc?exchange=binance&pair=ETH/USDT',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'CEXA test ocean.py#990 (3)',
      tags: ['defi'],
      type: 'dataset',
      updated: '2022-10-05T09:42:06Z'
    },
    nft: {
      address: '0x0fb9814D744ed407878D6D7508649b8D43F6b30a',
      created: '2022-10-05T09:49:12',
      name: 'Ocean Data NFT',
      owner: '0xF5dcd98a1C99c2c65C62025Cb23cFB6f12F35497',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDoxOTFhZjcxZTI3MWQ0ZWI2ZjlhYzU4MmIyYTZhNzhlOGQ3OTE2N2RhN2ExM2EzMDg3OGM3YjY5OTg0MmFhNDIxIiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjE5MWFmNzFlMjcxZDRlYjZmOWFjNTgyYjJhNmE3OGU4ZDc5MTY3ZGE3YTEzYTMwODc4YzdiNjk5ODQyYWE0MjEiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDI4QzEwLDI1IDIxLDIyIDMzLDIzQzQ0LDIzIDU3LDI4IDY5LDI5QzgwLDI5IDg5LDI0IDk5LDIwTDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw0NEMxMiw0OCAyNSw1MiAzNyw1NEM0OCw1NSA1OCw1MiA2OSw1MUM3OSw0OSA4OSw0OCA5OSw0OEw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmZmJyBkPSdNMCw5OUwwLDc3QzksNzQgMTgsNzEgMjksNzBDMzksNjggNTIsNjcgNjQsNjlDNzUsNzAgODcsNzMgOTksNzdMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDL3N2ZyUzRSJ9'
    },
    nftAddress: '0x0fb9814D744ed407878D6D7508649b8D43F6b30a',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x89A0170556BB80438081D69F43d8C07a90e9Aa24',
        files:
          '0x040948a7677383b0c920458a6e1eca981061a9e4bf2b34a187d6fea73a21c568f9be5cb92233fc81e986e20b32c20d38a149ab45340b4a8ef9db0c8c000c7b2838b7a7496b5a4e670d97e3b6ed19af64635ba4ad737b2a90f377e5856ade60c0dad8375033d4a134cbff122234bb60e6e3e282e5dbdd6d3b0f9d5a7910e6a77d62c617f08120ac5b5ec88aec6609f22e0e24fe558e87865dc42278d09d5f4a2a30ac869f48221c481feee2dc0d39dc001c09e898964ccee99d16a24b4f41c3391dedc2f71140165541639c3d19385967347352be9c97fa8e7d9db842ab77eca21abf94edc422f83bd8017706d51791f2e282b5a0ec3a23521d898110aa66fa12a0ec6fa4258ca2cf4d7a6d1450b86eda81a936788fcd92f9754efa3fba4e69729e90d88bff58f12e5a1c76a24c57200a35f7bf71b9f525580e1f6ff7139c6c8f04fd4c59650dbfebaf5f5f1dccf4c3bc5d3a65b33c1d9107',
        id: '8573fbf5e2e5a90631e26bef416f140f815570b5124b8ad52812443d110a57c2',
        serviceEndpoint: 'https://v4.provider.polygon.oceanprotocol.com',
        timeout: 604800,
        type: 'access'
      }
    ],
    stats: {
      allocated: 11159.279296875,
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 2,
      publisherMarketOrderFee: '0',
      type: 'free',
      addressOrId: '0x89a0170556bb80438081d69f43d8c07a90e9aa24',
      price: '0',
      isPurchasable: true,
      datatoken: {
        address: '0x89a0170556bb80438081d69f43d8c07a90e9aa24',
        name: 'Invidious Octopus Token',
        symbol: 'INVOCT-85'
      },
      baseToken: null,
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0xAd42c7AfEe47140B5CD87F05d5846c418145f43A',
        name: 'Zealous Clam Token',
        serviceId:
          '081b597131102e14ea5f16d6ba49f46889fb700f88f9430d03ec64441280a894',
        symbol: 'ZEACLA-28'
      }
    ],
    event: {
      block: 7714916,
      contract: '0xeE1c6bE384D3ee734E906443E9d893b03852bFC6',
      datetime: '2022-10-05T07:41:24',
      from: '0x3e81AA994f774eE914D57946DDF2486EA7d42D65',
      tx: '0x20e01c84928b5432216cb7046dc81b50e2902e3e65d1a9b0c93fb7b772e2d979'
    },
    id: 'did:op:50c60ce0810bf8f8b1c6ca421e5231b106cf4de784945037498c84147e11dbc5',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'aaa',
      created: '2022-10-05T07:40:44Z',
      description: 'asda asda dsadadada',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Free testing',
      tags: ['aaa'],
      type: 'dataset',
      updated: '2022-10-05T07:40:44Z'
    },
    nft: {
      address: '0xeE1c6bE384D3ee734E906443E9d893b03852bFC6',
      created: '2022-10-05T07:41:24',
      name: 'Ocean Data NFT',
      owner: '0x3e81AA994f774eE914D57946DDF2486EA7d42D65',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDo1MGM2MGNlMDgxMGJmOGY4YjFjNmNhNDIxZTUyMzFiMTA2Y2Y0ZGU3ODQ5NDUwMzc0OThjODQxNDdlMTFkYmM1IiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjUwYzYwY2UwODEwYmY4ZjhiMWM2Y2E0MjFlNTIzMWIxMDZjZjRkZTc4NDk0NTAzNzQ5OGM4NDE0N2UxMWRiYzUiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDIwQzEzLDI0IDI3LDI4IDM3LDI3QzQ2LDI1IDUzLDE5IDYzLDE4QzcyLDE2IDg1LDIwIDk5LDI1TDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw1NkM4LDU0IDE3LDUzIDI5LDUzQzQwLDUyIDU0LDUxIDY3LDUyQzc5LDUyIDg5LDUzIDk5LDU1TDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyZmYnIGQ9J00wLDk5TDAsNjlDMTEsNzMgMjIsNzcgMzQsNzdDNDUsNzYgNTgsNzEgNjksNjlDNzksNjYgODksNjcgOTksNjhMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDL3N2ZyUzRSJ9'
    },
    nftAddress: '0xeE1c6bE384D3ee734E906443E9d893b03852bFC6',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0xAd42c7AfEe47140B5CD87F05d5846c418145f43A',
        files:
          '0x0431fb7120723def69d30ee6aede9846cf0578ae44e22459f7273e4b37f204832f4b87f0ea6cea7bbea820a35d0b18e6c599d3898368ddf03df6a5cd8003a0100274e8405f640815d18e63ce680c3a6fae28b71fc2e072d02c39618a85fa12528f0b740d9ea0f2b4d0795444794f1b614ef1a796deb2399ccaa5b709707a08d5a6b576eac811bfc35f9e02e8d778538dd989fe7d237e46bfffcd680cd9f70d30f5acbbcff33845a95aa1c310864ca95fb076a40174a307d3b71c3259bde027381460f02ff6bcdcfaee9edf6e74dc0adc465b4bcdaac74e6ca7f4181cec45cc5f2c925295b226e586935d7edd644ebe913c491ebfe6144bf605b330e42b7f35a88b55a1f7dc0b19851c0b032494e910b929831e9e5135d79134c2f3cd565a071327d7ba8b83357832603cec9aedc9',
        id: '081b597131102e14ea5f16d6ba49f46889fb700f88f9430d03ec64441280a894',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 0,
        type: 'access'
      }
    ],
    stats: {
      orders: 0,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 2,
      publisherMarketOrderFee: '0',
      type: 'free',
      addressOrId: '0xad42c7afee47140b5cd87f05d5846c418145f43a',
      price: '0',
      isPurchasable: true,
      datatoken: {
        address: '0xad42c7afee47140b5cd87f05d5846c418145f43a',
        name: 'Zealous Clam Token',
        symbol: 'ZEACLA-28'
      },
      baseToken: null,
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 137,
    credentials: {
      allow: [],
      deny: []
    },
    datatokens: [
      {
        address: '0xf31b9c3EEE46249c29339319Bfd41167DE5980f1',
        name: 'ETH predictions: DT1',
        serviceId: '0',
        symbol: 'DT1'
      }
    ],
    event: {
      block: 33937819,
      contract: '0xaD244AC409cEfA155059890b425b83F6A4146d69',
      datetime: '2022-10-04T22:43:00',
      from: '0x7BA3d8551A6f2C70a5d47bb448BcF7EF69661822',
      tx: '0xdef98b7863ca74caf4af17315942744bf8c1f909da9e4db1287c6acf2beba1d9'
    },
    id: 'did:op:f4b49d04ee8c6973e4f844754805dbfe9e682812121131abbfc1bdf6d6b6eef1',
    metadata: {
      author: '0x7BA3d',
      created: '2022-10-04T17:42:13.745633',
      description: 'ETH predictions',
      license: 'CC0: PublicDomain',
      name: 'ETH predictions',
      type: 'dataset',
      updated: '2022-10-04T17:42:13.745633'
    },
    nft: {
      address: '0xaD244AC409cEfA155059890b425b83F6A4146d69',
      created: '2022-10-04T22:43:00',
      name: 'ETH predictions',
      owner: '0x7BA3d8551A6f2C70a5d47bb448BcF7EF69661822',
      state: 0,
      symbol: 'ETH predictions',
      tokenURI: 'https://oceanprotocol.com/nft/'
    },
    nftAddress: '0xaD244AC409cEfA155059890b425b83F6A4146d69',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0xf31b9c3EEE46249c29339319Bfd41167DE5980f1',
        description: 'Download service',
        files:
          '0x044c33205fb032624a234ddce8c8e84b8311ded47f43edbea93825f670145ba127237837013705e7e173f7673f7a7f87be292687e373f13cad812f273f86e293f8c78367b496664c9ea82c5095871b0404def05e719b567bea0f523daf5054c3e2894140b5e9072e075c9df9b8039c5d434bd0569daff8d27c2b9544823890e5072d36f5f417cfe4c8f9c0b3fd48ed546b16fea54fbfff12c8da77549f49dbae52a4894e9ebe08c29903cf458815d43da1fc1ca89322c0cbc7f69e20d4489cb69d9272de03a6f7e89793d0ceda6a7eb41dfbf1d942a47773b32c2df2c4d81ca2ee79043819230621a351bcf0f67f377c7885c3578e4a4f75f9e30f779ffb0b0af81c02a8b8359831bfe4ed7cc1a267a133e09a5264dec1695801b3b3b15a26cf9a24dcb50620abed35fafe45eae01a1681f0aa85ba4648b6574e760eeb414ee18a1de319b0d06fbab40e8ed193fc',
        id: '0',
        name: 'Download service',
        serviceEndpoint: 'https://v4.provider.polygon.oceanprotocol.com',
        timeout: 3600,
        type: 'access'
      }
    ],
    stats: {
      allocated: 0,
      orders: 0,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      type: 'NOT_SUPPORTED'
    } as any
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0xf5dbd5a675248f92E3F37da98090144C1355ABb5',
        name: 'Feckless Orca Token',
        serviceId:
          '9dec1b8dbf546767988ca98374631b7325a5c0ddb5b75e21e6da0f527cc45285',
        symbol: 'FECORC-10'
      }
    ],
    event: {
      block: 7710252,
      contract: '0x4CA9EfCD6bbFC935FbBaaDAF65aA6f8Fc3504fe1',
      datetime: '2022-10-04T12:45:00',
      from: '0x9c4e3CaE2B87180BEa0238b25bacf38473c39e11',
      tx: '0x01d95a564f99e8c1e7cc585ed00435b405723751ad96e57e86851763f7222ce4'
    },
    id: 'did:op:82698600c9f003bdfa97bf054b5bb9b0f83c18b4ea748ce1eddbab8110ff9ea9',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'Jamie',
      created: '2022-10-04T12:44:40Z',
      description:
        'Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data Test Data ',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Test Data',
      tags: ['test'],
      type: 'dataset',
      updated: '2022-10-04T12:44:40Z'
    },
    nft: {
      address: '0x4CA9EfCD6bbFC935FbBaaDAF65aA6f8Fc3504fe1',
      created: '2022-10-04T12:45:00',
      name: 'Ocean Data NFT',
      owner: '0x9c4e3CaE2B87180BEa0238b25bacf38473c39e11',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDo4MjY5ODYwMGM5ZjAwM2JkZmE5N2JmMDU0YjViYjliMGY4M2MxOGI0ZWE3NDhjZTFlZGRiYWI4MTEwZmY5ZWE5IiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjgyNjk4NjAwYzlmMDAzYmRmYTk3YmYwNTRiNWJiOWIwZjgzYzE4YjRlYTc0OGNlMWVkZGJhYjgxMTBmZjllYTkiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDE3QzYsMTYgMTMsMTYgMjIsMTdDMzAsMTcgNDAsMTkgNTAsMjBDNTksMjAgNjcsMjEgNzUsMjFDODIsMjAgOTAsMTkgOTksMTlMOTksOTlaJy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmJiJyBkPSdNMCw5OUwwLDU0QzYsNTAgMTMsNDcgMjIsNDdDMzAsNDYgMzksNDkgNDksNTJDNTgsNTQgNjgsNTggNzcsNTdDODUsNTUgOTIsNDkgOTksNDNMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJmZicgZD0nTTAsOTlMMCw4MkM3LDgwIDE1LDc5IDI0LDc2QzMyLDcyIDQwLDY2IDQ5LDY4QzU3LDY5IDY0LDc4IDczLDgxQzgxLDgzIDkwLDgwIDk5LDc4TDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQy9zdmclM0UifQ=='
    },
    nftAddress: '0x4CA9EfCD6bbFC935FbBaaDAF65aA6f8Fc3504fe1',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0xf5dbd5a675248f92E3F37da98090144C1355ABb5',
        files:
          '0x044434dfd2c80154b1a0641420a12d694ea9c762f9a7ca79ca467b5e1995ed2ee5cfe3460a368840ba290dfdec634c72e4204f12cb17a3f4f7108a253d11ed3a5294187b2bc7c8f24e39568a912914732bd2dd2707b0f416f1e729b2eb71f5656e10b33dba2ecd012dfbe01fa2c9dfb850a2386fc4962e5ccdc660b959fd00adef1c70c0f2b4a26df063a52197791bf9eed9136f1ad7b8a6073e196b2cbfb8b4d2a1dd023c15481b956c9419b47df921d72e3706820d4f5f26374fd0ee1bd6cfd9aead3e7168759419f404fac6f9779233c328a26ea41cb5c064cfb342d01fc7bc10a5766407dfc5a5dc3e0cbfc95f8b4cbe8f00895b02d4b42ccb2bbc465ef1e7026c0d922ef7877b1d6065e03922d9549f9aad490f07a03aa713d3028d489a11bcd3be12e2bf6a8d3d6c1a1108401786b5598c6c1411d9f562c137fd991fb2ebd6d1bbb7f46d5392387d0764bb',
        id: '9dec1b8dbf546767988ca98374631b7325a5c0ddb5b75e21e6da0f527cc45285',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 0,
        type: 'access'
      }
    ],
    stats: {
      orders: 1,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 2,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0xadd592e83c3830058bb3649e499b9066c681616ffe6ea12e28dc6adcc63dac16',
      price: '1',
      isPurchasable: true,
      baseToken: {
        address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0xf5dbd5a675248f92e3f37da98090144c1355abb5',
        name: 'Feckless Orca Token',
        symbol: 'FECORC-10'
      },
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 5,
    datatokens: [
      {
        address: '0x23C1FD10DADCaF558fB7173b79CfD0D867568a3D',
        name: 'Equanimous Barracuda Token',
        serviceId:
          '89d66d7e77abccb2899b224662a733b42edefeb769138d6562928c38f75b4caa',
        symbol: 'EQUBAR-39'
      }
    ],
    event: {
      block: 7716390,
      contract: '0x3A695322d631451474090F322eA3d8d2eC8c1562',
      datetime: '2022-10-05T13:51:24',
      from: '0x903322C7E45A60d7c8C3EA236c5beA9Af86310c7',
      tx: '0xcea2e02cb67c0c545976baf419a1cacbcad6fd2c4308eca93c49a3135a90e40c'
    },
    id: 'did:op:9c1235050bcd51c8ec9a7058110102c9595136834911c315b4f739bc9a880b8e',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'Jelly',
      created: '2022-10-04T11:38:49Z',
      description: 'Testitestvwgre btewwgte',
      license: 'https://market.oceanprotocol.com/terms',
      name: 'Testitest',
      tags: [],
      type: 'dataset',
      updated: '2022-10-04T11:38:49Z'
    },
    nft: {
      address: '0x3A695322d631451474090F322eA3d8d2eC8c1562',
      created: '2022-10-04T11:39:12',
      name: 'Ocean Data NFT',
      owner: '0x903322C7E45A60d7c8C3EA236c5beA9Af86310c7',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDo5YzEyMzUwNTBiY2Q1MWM4ZWM5YTcwNTgxMTAxMDJjOTU5NTEzNjgzNDkxMWMzMTViNGY3MzliYzlhODgwYjhlIiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjljMTIzNTA1MGJjZDUxYzhlYzlhNzA1ODExMDEwMmM5NTk1MTM2ODM0OTExYzMxNWI0ZjczOWJjOWE4ODBiOGUiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDIxQzExLDIwIDIyLDIwIDMzLDIxQzQzLDIxIDU0LDIyIDY1LDIzQzc1LDIzIDg3LDIyIDk5LDIyTDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw1M0MxMiw0OCAyNSw0NCAzNiw0NUM0Niw0NSA1NCw1MSA2NSw1M0M3NSw1NCA4Nyw1MSA5OSw0OUw5OSw5OVonJTNFJTNDL3BhdGglM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5MmZmJyBkPSdNMCw5OUwwLDY4QzEyLDczIDI1LDc4IDM2LDgwQzQ2LDgxIDU0LDc4IDY1LDc3Qzc1LDc1IDg3LDc1IDk5LDc2TDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQy9zdmclM0UifQ=='
    },
    nftAddress: '0x3A695322d631451474090F322eA3d8d2eC8c1562',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x23C1FD10DADCaF558fB7173b79CfD0D867568a3D',
        files:
          '0x042f150d201313fa28d6d4ecd45b65eab2a3f88eaae50570d9e6a903b071c74eca5c129d38b7c5adf871e70fc586daba5d8788c405208238a9974519f086a28c9366e049b07eae6ab20f2752ed382a6123a49d74c7f2134f14632393851ead2be2df2634f9b4db2126085cdc57d2e2d144c219bc7a546b2030d128e23c0056da8c26f6d7bffb389c31d76916dd5c6f94f5c7d9a532dd6d3c210bed0f7486e41411911f446a020628136efc3acfa39573dc54ab0b29fbd8985f64a88cc20d2f9a2e0688ff1b8458f8f1a46be4633045b5e9313b612e96dae44f4c9258c2420c13a2bac8082461141b036065c0187b119586c1ea7225e1599e520a34da5e4510d8bec879d982ebf951566ece9ef58c1eb43ac07570a6a8e542b29460bf52914a9f8f3dfd7e423d87dd618e2b04db54e5f7dcf91976cee59ddd63bb09a09ecc98ba44005a',
        id: '89d66d7e77abccb2899b224662a733b42edefeb769138d6562928c38f75b4caa',
        serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
        timeout: 0,
        type: 'access'
      }
    ],
    stats: {
      orders: 0,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 2,
      publisherMarketOrderFee: '0',
      type: 'free',
      addressOrId: '0x23c1fd10dadcaf558fb7173b79cfd0d867568a3d',
      price: '0',
      isPurchasable: true,
      datatoken: {
        address: '0x23c1fd10dadcaf558fb7173b79cfd0d867568a3d',
        name: 'Equanimous Barracuda Token',
        symbol: 'EQUBAR-39'
      },
      baseToken: null,
      isOwned: false,
      validOrderTx: null
    }
  },
  {
    '@context': ['https://w3id.org/did/v1'],
    chainId: 1,
    datatokens: [
      {
        address: '0x98d87B273Ed411A5940a0C4a3717d58C81917Eb5',
        name: 'Egregious Anchovy Token',
        serviceId:
          '60be64b7b7b10944c2b3eac740f476d85b2625a5db32bd0a3db1959f9a8100bb',
        symbol: 'EGRANC-29'
      }
    ],
    event: {
      block: 15671852,
      contract: '0x3a1deC08e0367D8eCCBa714DF23949c105B7D06B',
      datetime: '2022-10-04T02:38:59',
      from: '0x8542472a8De568cD3B09A53368C1962d8DfDBE2f',
      tx: '0x9f717d0386598349b0e19c45f7dcf2ead5b219b25e1fc08902ebe651c48398fb'
    },
    id: 'did:op:9442a55c25e9a0fd30231089ec34e430d0325ce0d3e03ab1aa27579eb56f7570',
    metadata: {
      additionalInformation: {
        termsAndConditions: true
      },
      author: 'Internet crawler',
      created: '2022-10-04T02:38:44Z',
      description:
        'Dataset contains personal info of USA citizen (around 157 criteria) such as: email, phone, name, address, geo location, household, real estate, salary, income, etc. Around 500k citizens. Dataset is helpful for financial, real estate companies who want to use it to train their AI/ML model. Or for marketing , sales purposes.',
      license: 'https://market.oceanprotocol.com/terms',
      links: [
        'https://drive.google.com/file/d/1oPX-LHBBV6IkQ3kHD7-25jmMVx4ZMoFU/view?usp=sharing'
      ],
      name: '500k USA citizen dataset including PII, real estate info, salary, household, etc',
      tags: [
        'ai',
        'machine-learning',
        'real-estate',
        'finance',
        'usa-citizen',
        'pii'
      ],
      type: 'dataset',
      updated: '2022-10-04T02:38:44Z'
    },
    nft: {
      address: '0x3a1deC08e0367D8eCCBa714DF23949c105B7D06B',
      created: '2022-10-04T02:38:59',
      name: 'Ocean Data NFT',
      owner: '0x8542472a8De568cD3B09A53368C1962d8DfDBE2f',
      state: 0,
      symbol: 'OCEAN-NFT',
      tokenURI:
        'data:application/json;base64,eyJuYW1lIjoiT2NlYW4gRGF0YSBORlQiLCJzeW1ib2wiOiJPQ0VBTi1ORlQiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gYXNzZXQgaW4gdGhlIE9jZWFuIFByb3RvY29sIHY0IGVjb3N5c3RlbS5cblxuVmlldyBvbiBPY2VhbiBNYXJrZXQ6IGh0dHBzOi8vbWFya2V0Lm9jZWFucHJvdG9jb2wuY29tL2Fzc2V0L2RpZDpvcDo5NDQyYTU1YzI1ZTlhMGZkMzAyMzEwODllYzM0ZTQzMGQwMzI1Y2UwZDNlMDNhYjFhYTI3NTc5ZWI1NmY3NTcwIiwiZXh0ZXJuYWxfdXJsIjoiaHR0cHM6Ly9tYXJrZXQub2NlYW5wcm90b2NvbC5jb20vYXNzZXQvZGlkOm9wOjk0NDJhNTVjMjVlOWEwZmQzMDIzMTA4OWVjMzRlNDMwZDAzMjVjZTBkM2UwM2FiMWFhMjc1NzllYjU2Zjc1NzAiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiMTQxNDE0IiwiaW1hZ2VfZGF0YSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgdmlld0JveD0nMCAwIDk5IDk5JyBmaWxsPSd1bmRlZmluZWQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9JyUyM2ZmNDA5Mjc3JyBkPSdNMCw5OUwwLDIyQzEyLDIyIDI1LDIyIDM2LDIzQzQ2LDIzIDUzLDI1IDY0LDI2Qzc0LDI2IDg2LDI2IDk5LDI2TDk5LDk5WicvJTNFJTNDcGF0aCBmaWxsPSclMjNmZjQwOTJiYicgZD0nTTAsOTlMMCw0NkM4LDQ3IDE3LDQ4IDI5LDQ4QzQwLDQ3IDU1LDQ2IDY4LDQ3QzgwLDQ3IDg5LDUwIDk5LDUzTDk5LDk5WiclM0UlM0MvcGF0aCUzRSUzQ3BhdGggZmlsbD0nJTIzZmY0MDkyZmYnIGQ9J00wLDk5TDAsNjhDMTAsNzMgMjAsNzkgMzAsODBDMzksODAgNDksNzYgNjEsNzVDNzIsNzMgODUsNzUgOTksNzhMOTksOTlaJyUzRSUzQy9wYXRoJTNFJTNDL3N2ZyUzRSJ9'
    },
    nftAddress: '0x3a1deC08e0367D8eCCBa714DF23949c105B7D06B',
    purgatory: {
      state: false,
      reason: ''
    },
    services: [
      {
        datatokenAddress: '0x98d87B273Ed411A5940a0C4a3717d58C81917Eb5',
        files:
          '0x04a233b66ca6261147f2729d818d4929a797565508daa51f8041bc07fb47d4374702d5cc0528e80d3a6d039df3ba155cdc251f719e8438f1788aed571b98bb301dfd17fe1b4756cd2652ea9f42ca2b3ec3bc40072215ce0dd9504a1d207a3582dee897597117c02013f8e8aefae8843415784db6e7870b6649f434d7eeed5d2adad1e874c18d826171da760fcfe4a3dfec1816bd494f969c290203707037d5e342d37713fef97ddc36b5e6c9a70e7085d841663705314451d3cbcb08dbc24f2baf365ea09160f4b581c93b415188f0e31aa1365a7be1cdbf8ea912aad046e94a801926b6576a47789dab193b28566b7b650c425b51c5c9865936c76c81e51a54986231d37aa518c2b3e629198f77b343d260a1c697f0ae168d405abd2e38e42a121ebaa3ccec8e8d562dcbadcabf5667aa48663e3ec34af9db86dfcc3dc5749ec4878e8fd643036a693ca4e7589d3e1fa93d936f80e4301ad06f30d9469a82ae3e94ebc94c5d19b708',
        id: '60be64b7b7b10944c2b3eac740f476d85b2625a5db32bd0a3db1959f9a8100bb',
        serviceEndpoint: 'https://v4.provider.mainnet.oceanprotocol.com',
        timeout: 0,
        type: 'access'
      }
    ],
    stats: {
      allocated: 422.9883117676,
      orders: 0,
      price: {
        value: 3231343254,
        tokenAddress: '0xCfDdA22C9837aE76E0faA845354f33C62E03653a',
        tokenSymbol: 'OCEAN'
      }
    },
    version: '4.1.0',
    accessDetails: {
      templateId: 2,
      publisherMarketOrderFee: '0',
      type: 'fixed',
      addressOrId:
        '0xfcf20144a14c7b2f51319d938436e34041acbd65e1e29319549ed7923b9fd86e',
      price: '1000000',
      isPurchasable: true,
      baseToken: {
        address: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
      },
      datatoken: {
        address: '0x98d87b273ed411a5940a0c4a3717d58c81917eb5',
        name: 'Egregious Anchovy Token',
        symbol: 'EGRANC-29'
      },
      isOwned: false,
      validOrderTx: null
    }
  }
]
