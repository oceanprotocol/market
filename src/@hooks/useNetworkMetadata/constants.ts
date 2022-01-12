import { getOceanConfig } from '@utils/ocean'

const configGaiaX = getOceanConfig(2021000)

export const networkDataGaiaX: EthereumListsChain = {
  name: 'GAIA-X Testnet',
  chainId: 2021000,
  shortName: 'GAIA-X',
  chain: 'GAIA-X',
  networkId: 2021000,
  nativeCurrency: { name: 'Gaia-X', symbol: 'GX', decimals: 18 },
  rpc: [configGaiaX.nodeUri],
  faucets: [
    'https://faucet.gaiaxtestnet.oceanprotocol.com/',
    'https://faucet.gx.gaiaxtestnet.oceanprotocol.com/'
  ],
  infoURL: 'https://www.gaia-x.eu',
  explorers: [{ name: '', url: '', standard: '' }]
}
