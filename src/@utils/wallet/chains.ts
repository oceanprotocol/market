import { Chain } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'

export const energyWeb = {
  id: 246,
  name: 'Energy Web Chain',
  network: 'energyweb',
  nativeCurrency: {
    decimals: 18,
    name: 'EWT',
    symbol: 'EWT'
  },
  rpcUrls: {
    public: {
      http: ['https://rpc.energyweb.org'],
      webSocket: ['wss://rpc.energyweb.org/ws']
    },
    default: {
      http: ['https://rpc.energyweb.org'],
      webSocket: ['wss://rpc.energyweb.org/ws']
    }
  },
  blockExplorers: {
    default: {
      name: 'Energy Web Chain',
      url: 'https://explorer.energyweb.org/'
    },
    blockscout: {
      name: 'Energy Web Chain',
      url: 'https://explorer.energyweb.org/'
    }
  },
  testnet: false
} as Chain

// TODO: remove once moonriver is shipped in wagmi as it is already in codebase
// https://github.com/wagmi-dev/references/blob/main/packages/chains/src/moonriver.ts
export const moonriver = {
  id: 1285,
  name: 'Moonriver',
  network: 'moonriver',
  nativeCurrency: {
    decimals: 18,
    name: 'MOVR',
    symbol: 'MOVR'
  },
  rpcUrls: {
    public: {
      http: ['https://moonriver.public.blastapi.io'],
      webSocket: ['wss://moonriver.public.blastapi.io']
    },
    default: {
      http: ['https://moonriver.public.blastapi.io'],
      webSocket: ['wss://moonriver.public.blastapi.io']
    }
  },
  blockExplorers: {
    default: {
      name: 'Moonscan',
      url: 'https://moonriver.moonscan.io'
    },
    etherscan: {
      name: 'Moonscan',
      url: 'https://moonriver.moonscan.io'
    }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1597904
    }
  },
  testnet: false
} as Chain

export const getSupportedChains = (chainIdsSupported: number[]): Chain[] => {
  const chains = [wagmiChains, energyWeb, moonriver].map((chain) => {
    return Object.values(chain).filter((chain) =>
      chainIdsSupported.includes(chain.id)
    )
  })
  console.log(chains.flat())
  return chains.flat()
}
