import { useEffect, useState } from 'react'
import { Router as FactoryRouter, LoggerInstance } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { useNetwork, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import { Fees, TokenDetails } from '../@types/factoryRouter/FactoryRouter.type'
import { OpcFee } from '@context/MarketMetadata/_types'

function useFactoryRouter() {
  const { chain } = useNetwork()
  const { data: signer } = useSigner()
  const [factoryRouter, setFactoryRouter] = useState<FactoryRouter>()
  const [approvedTokens, setApprovedTokens] = useState<TokenDetails[]>([])
  const [fees, setFees] = useState<Fees>({
    swapOceanFee: '0',
    swapNonOceanFee: '0',
    consumeFee: '0',
    providerFee: '0'
  })

  useEffect(() => {
    if (!signer || !chain?.id) return
    const config = getOceanConfig(chain.id)
    setFactoryRouter(
      new FactoryRouter(config?.routerFactoryAddress, signer, config.chainId)
    )
  }, [signer, chain?.id])

  const fetchFees = async (router: FactoryRouter) => {
    try {
      const [opcFees, consumeFee, providerFee] = await Promise.all([
        router.contract.getOPCFees(),
        router.contract.getOPCConsumeFee(),
        router.contract.getOPCProviderFee()
      ])
      return {
        swapOceanFee: ethers.utils.formatUnits(opcFees[0], 18),
        swapNonOceanFee: ethers.utils.formatUnits(opcFees[1], 18),
        consumeFee: ethers.utils.formatUnits(consumeFee, 18),
        providerFee: ethers.utils.formatUnits(providerFee, 18)
      }
    } catch (error) {
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
    const tokenContract = new ethers.Contract(
      tokenAddress,
      tokenAbi,
      signer.provider
    )

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
      const opcData = await Promise.all(
        validChainIds.map(async (chainId) => {
          const fees = await fetchFees(factoryRouter)
          const approvedTokensAddresses =
            await factoryRouter.contract.getApprovedTokens()
          const tokenDetails: TokenDetails[] = await Promise.all(
            approvedTokensAddresses.map((tokenAddress) =>
              fetchTokenDetails(tokenAddress)
            )
          )
          return {
            chainId,
            approvedTokens: tokenDetails.map((token) => token.address),
            swapApprovedFee: fees.swapOceanFee,
            swapNotApprovedFee: fees.swapNonOceanFee
          }
        })
      )

      return opcData as OpcFee[]
    }

    if (factoryRouter) {
      return fetchOpcData(chainIds)
    }
  }

  return { approvedTokens, fees, signer, getOpcData }
}

export default useFactoryRouter
