import { Config } from '@oceanprotocol/squid'

export enum OceanNetworkChainIds {
  'Pacific' = 846353,
  'Nile' = 8995,
  'Spree' = 8996
}
declare type OceanNetworks =
  | OceanNetworkChainIds.Pacific
  | OceanNetworkChainIds.Nile
  | OceanNetworkChainIds.Spree

export interface OceanConfig extends Config {
  faucetUri: string
  ratingUri: string
}

// why is this partial?
// export const config: Partial<OceanConfig> = {
//   nodeUri: process.env.NODE_URI || 'https://pacific.oceanprotocol.com',
//   aquariusUri:
//     process.env.AQUARIUS_URI ||
//     'https://aquarius.marketplace.oceanprotocol.com',
//   brizoUri:
//     process.env.BRIZO_URI || 'https://brizo.marketplace.oceanprotocol.com',
//   brizoAddress:
//     process.env.BRIZO_ADDRESS || '0x00c6A0BC5cD0078d6Cd0b659E8061B404cfa5704',
//   secretStoreUri:
//     process.env.SECRET_STORE_URI || 'https://secret-store.oceanprotocol.com',
//   faucetUri: process.env.FAUCET_URI || 'https://faucet.oceanprotocol.com',
//   ratingUri:
//     process.env.RATING_URI || 'https://rating.pacific.marketplace.dev-ocean.com',
//   verbose: 3
// }

// why is this partial?
export const config: OceanConfig = {
  nodeUri: 'https://pacific.oceanprotocol.com',
  aquariusUri: 'https://aquarius.marketplace.oceanprotocol.com',
  brizoUri: 'https://brizo.marketplace.oceanprotocol.com',
  brizoAddress: '0x00c6A0BC5cD0078d6Cd0b659E8061B404cfa5704',
  secretStoreUri: 'https://secret-store.oceanprotocol.com',
  faucetUri: 'https://faucet.oceanprotocol.com',
  ratingUri: 'https://rating.pacific.marketplace.dev-ocean.com',
  verbose: 3
}

export const CHAIN_IDS = [
  OceanNetworkChainIds.Pacific,
  OceanNetworkChainIds.Nile,
  OceanNetworkChainIds.Spree
]
