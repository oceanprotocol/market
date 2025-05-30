import { Chain } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'

export const getSupportedChains = (chainIdsSupported: number[]): Chain[] => {
  const supportedChains = [wagmiChains]
    .map((chain) => {
      return Object.values(chain).filter((chain) =>
        chainIdsSupported.includes(chain.id)
      )
    })
    .flat()

  // Current version of wagmi doesn't support custom RPCs (e.g blastapi)
  // Override RPC URLs for chains if it's set in env
  const chains = supportedChains.map((chain) => {
    if (chain.id === 11155111 && process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL) {
      return {
        ...chain,
        rpcUrls: {
          public: { http: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL] },
          default: { http: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL] }
        }
      }
    }
    return chain
  })

  return chains
}
