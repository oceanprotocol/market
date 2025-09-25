// src/@utils/wallet/chains.ts
import type { Chain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

function getSepoliaWithRpcOverride(): Chain {
  const envRpc =
    process.env.NEXT_PUBLIC_RPC_URI ||
    process.env.NEXT_PUBLIC_NODE_URI || // opcional, por si lo tenías ya
    (process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
      ? `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
      : undefined)

  if (!envRpc) return sepolia

  return {
    ...sepolia,
    rpcUrls: {
      ...sepolia.rpcUrls,
      public: { http: [envRpc] },
      default: { http: [envRpc] }
    }
  }
}

const CHAIN_MAP: Record<number, Chain> = {
  11155111: getSepoliaWithRpcOverride()
}

export function getSupportedChains(ids: number[]): Chain[] {
  return (ids || []).map((id) => CHAIN_MAP[id]).filter(Boolean)
}
