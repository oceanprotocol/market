import { useEffect, useState } from 'react'
import { Router as FactoryRouter } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { Fees, TokenDetails } from '../@types/factoryRouter/FactoryRouter.type'
import { OpcFee } from '@context/MarketMetadata/_types'
import { useAppKitNetworkCore } from '@reown/appkit/react'
import { useSigner } from './useSigner'
import { Contract, formatUnits } from 'ethers'
import { useProvider } from './useProvider'

function useFactoryRouter() {
  const { chainId } = useAppKitNetworkCore()
  const { signer } = useSigner()
  const provider = useProvider()

  const [factoryRouter, setFactoryRouter] = useState<FactoryRouter>()
  const [approvedTokens, setApprovedTokens] = useState<TokenDetails[]>([])
  const [fees, setFees] = useState<Fees>({
    swapOceanFee: '0',
    swapNonOceanFee: '0',
    consumeFee: '0',
    providerFee: '0'
  })

  useEffect(() => {
    if (!signer || !chainId) return
    const config = getOceanConfig(chainId)
    if (!config) return
    setFactoryRouter(
      new FactoryRouter(config?.routerFactoryAddress, signer, config.chainId)
    )
  }, [signer, chainId])

  const fetchFees = async (router: FactoryRouter) => {
    try {
      const [opcFees, consumeFee, providerFee] = await Promise.all([
        router.contract.getOPCFees(),
        router.contract.getOPCConsumeFee(),
        router.contract.getOPCProviderFee()
      ])

      return {
        swapOceanFee: formatUnits(opcFees[0], 18),
        swapNonOceanFee: formatUnits(opcFees[1], 18),
        consumeFee: formatUnits(consumeFee, 18),
        providerFee: formatUnits(providerFee, 18)
      }
    } catch (error: any) {
      if (
        error.code === 'NETWORK_ERROR' &&
        error.message?.includes('underlying network changed')
      ) {
        console.warn('Network changed during fetchFees, skipping...')
        return
      }

      console.error('Error fetching fees:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchFees(factoryRouter)
      setFees(result)
    }
    if (factoryRouter) {
      fetchData()
    }
  }, [factoryRouter])

  const fetchTokenDetails = async (tokenAddress: string) => {
    const tokenAbi = [
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function name() view returns (string)'
    ]
    const tokenContract = new Contract(tokenAddress, tokenAbi, provider)

    const [decimals, symbol, name] = await Promise.all([
      tokenContract.decimals(),
      tokenContract.symbol(),
      tokenContract.name()
    ])

    return { address: tokenAddress, decimals, symbol, name }
  }

  useEffect(() => {
    const fetchApprovedTokens = async () => {
      if (!factoryRouter) return

      try {
        const approvedTokens = await factoryRouter.contract.getApprovedTokens()
        const tokenDetails = await Promise.all(
          approvedTokens.map((tokenAddress) => fetchTokenDetails(tokenAddress))
        )
        setApprovedTokens(tokenDetails)
      } catch (error) {
        console.error('Error fetching approved tokens:', error)
      }
    }

    if (factoryRouter) {
      fetchApprovedTokens()
    }
  }, [factoryRouter])
  const getOpcData = async (chainIds: number[]) => {
    const fetchOpcData = async (chainIds: number[]) => {
      const validChainIds = chainIds.filter((chainId) => {
        const config = getOceanConfig(chainId)
        return !!config?.routerFactoryAddress
      })

      const opcData: OpcFee[] = []

      for (const chainId of validChainIds) {
        try {
          const fees = await fetchFees(factoryRouter)
          const approvedTokensAddresses =
            await factoryRouter.contract.getApprovedTokens()
          const tokenDetails: TokenDetails[] = await Promise.all(
            approvedTokensAddresses.map((tokenAddress) =>
              fetchTokenDetails(tokenAddress)
            )
          )

          opcData.push({
            chainId,
            approvedTokens: tokenDetails.map((token) => token.address),
            swapApprovedFee: fees?.swapOceanFee || '0',
            swapNotApprovedFee: fees?.swapNonOceanFee || '0'
          })
        } catch (error: any) {
          if (
            error.code === 'NETWORK_ERROR' &&
            error.message?.includes('underlying network changed')
          ) {
            console.warn(
              `Network changed during fetch for chainId ${chainId}, skipping...`
            )
            continue
          }

          console.error(
            `Error fetching OPC data for chainId ${chainId}:`,
            error
          )
        }
      }

      return opcData
    }

    if (factoryRouter) {
      return fetchOpcData(chainIds)
    }
  }

  return { approvedTokens, fees, signer, getOpcData }
}

export default useFactoryRouter
