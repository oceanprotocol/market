export default {
  accountEns: 'jellymcjellyfish.eth',
  accountEnsAvatar:
    'https://metadata.ens.domains/mainnet/avatar/jellymcjellyfish.eth',
  accountId: '0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0',
  approvedBaseTokens: [
    {
      address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a',
      symbol: 'OCEAN',
      name: 'Ocean Token',
      decimals: 18
    }
  ],
  balance: { eth: '0', ocean: '1000' },
  block: 7751969,
  chainId: 5,
  connect: jest.fn(),
  isSupportedOceanNetwork: true,
  isTestnet: true,
  logout: jest.fn(),
  networkData: { name: 'Görli', title: 'Ethereum Testnet Görli', chain: 'ETH' },
  networkDisplayName: 'ETH Görli',
  networkId: 5,
  web3: { currentProvider: {} },
  web3Loading: false,
  web3Modal: { show: false, eventController: {}, connect: jest.fn() },
  web3Provider: {},
  web3ProviderInfo: {
    id: 'injected',
    name: 'MetaMask',
    logo: ''
  }
}
