import { useEffect, useMemo, useState } from 'react'
import { NftFactory } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { useNetwork, useSigner } from 'wagmi'
import { chainIdsSupported } from '../../app.config.cjs'

/**
 * Devuelve la instancia de NftFactory lista para usar, o undefined mientras no haya signer/config.
 * Aguanta casos donde chain todavía no está resuelta y cae a un fallback (primer id soportado).
 */
export default function useNftFactory(): NftFactory | undefined {
  const { chain } = useNetwork()
  const { data: signer } = useSigner()
  const [nftFactory, setNftFactory] = useState<NftFactory>()

  // Fallback: si aún no hay chain en wagmi, usa el primer chainId soportado (Sepolia)
  const chainId = useMemo<number>(() => {
    return chain?.id ?? chainIdsSupported?.[0] ?? 11155111
  }, [chain?.id])

  useEffect(() => {
    // sin signer no podemos instanciar la factory
    if (!signer || !chainId) return

    const config = getOceanConfig(chainId)
    if (!config) {
      console.error(`[useNftFactory] No config found for network ${chainId}`)
      setNftFactory(undefined)
      return
    }

    if (!config.nftFactoryAddress) {
      console.error(
        `[useNftFactory] Missing nftFactoryAddress for chain ${chainId} in your chains.config.cjs`
      )
      setNftFactory(undefined)
      return
    }

    try {
      const factory = new NftFactory(config.nftFactoryAddress, signer)
      setNftFactory(factory)
    } catch (e: any) {
      console.error('[useNftFactory] Error creating factory:', e?.message || e)
      setNftFactory(undefined)
    }
  }, [signer, chainId])

  return nftFactory
}
