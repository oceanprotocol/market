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

export const config: Partial<OceanConfig> = {
  nodeUri: process.env.NODE_URI || 'https://pacific.oceanprotocol.com',
  aquariusUri:
    process.env.AQUARIUS_URI ||
    'https://aquarius.pacific.dexfreight.dev-ocean.com',
  brizoUri:
    process.env.BRIZO_URI || 'https://brizo.pacific.dexfreight.dev-ocean.com',
  brizoAddress:
    process.env.BRIZO_ADDRESS || '0xeD792C5FcC8bF3322a6ba89A6e51eF0B6fB3C530',
  secretStoreUri:
    process.env.SECRET_STORE_URI || 'https://secret-store.oceanprotocol.com',
  faucetUri: process.env.FAUCET_URI || 'https://faucet.oceanprotocol.com',
  ratingUri:
    process.env.RATING_URI || 'https://rating.pacific.dexfreight.dev-ocean.com',
  verbose: 3
}

export const CHAIN_IDS = [
  OceanNetworkChainIds.Pacific,
  OceanNetworkChainIds.Nile,
  OceanNetworkChainIds.Spree
]
