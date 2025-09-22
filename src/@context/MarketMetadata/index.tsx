import React, {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { MarketMetadataProviderValue, OpcFee } from './_types'
import siteContent from '../../../content/site.json'
import appConfig from '../../../app.config.cjs'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useConnect } from 'wagmi'
import useFactoryRouter from '@hooks/useRouter'
import { getApprovedBaseTokensForNetwork } from '@utils/tokens'

const MarketMetadataContext = createContext({} as MarketMetadataProviderValue)

function MarketMetadataProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { isLoading } = useConnect()
  const { signer, getOpcData } = useFactoryRouter()

  const [opcFees, setOpcFees] = useState<OpcFee[]>()
  const [approvedBaseTokens, setApprovedBaseTokens] = useState<TokenInfo[]>()
  const [currentChainId, setCurrentChainId] = useState<number>()

  useEffect(() => {
    async function getData() {
      const opcData = await getOpcData(appConfig.chainIdsSupported)
      LoggerInstance.log('[MarketMetadata] Got new data.', {
        opcFees: opcData,
        siteContent,
        appConfig
      })
      setOpcFees(opcData)
    }
    if (signer) {
      getData()
    }
  }, [signer])

  const getOpcFeeForToken = useCallback(
    (tokenAddress: string, chainId: number): string => {
      if (!opcFees) return '0'

      const opc = opcFees.filter((x) => x.chainId === chainId)[0]
      const isTokenApproved = opc.approvedTokens.includes(tokenAddress)
      return isTokenApproved ? opc.swapApprovedFee : opc.swapNotApprovedFee
    },
    [opcFees]
  )

  // -----------------------------------
  // Get and set approved base tokens list
  // -----------------------------------

  useEffect(() => {
    if (isLoading) return

    if (signer?.provider) {
      signer.provider.getNetwork().then((network) => {
        setCurrentChainId(Number(network.chainId))
      })
    }
  }, [isLoading, signer])

  useEffect(() => {
    if (!currentChainId) return

    const networkTokens = getApprovedBaseTokensForNetwork(
      currentChainId,
      appConfig.oceanTokenAddress,
      appConfig.approvedBaseTokens?.customTokens,
      appConfig.approvedBaseTokens?.autoAddWETH ?? true
    )

    LoggerInstance.log(
      '[MarketMetadata] Setting approved base tokens for chain:',
      {
        chainId: currentChainId,
        tokens: networkTokens
      }
    )

    setApprovedBaseTokens(networkTokens)
  }, [
    currentChainId,
    appConfig.oceanTokenAddress,
    appConfig.approvedBaseTokens
  ])

  return (
    <MarketMetadataContext.Provider
      value={
        {
          opcFees,
          siteContent,
          appConfig,
          getOpcFeeForToken,
          approvedBaseTokens
        } as MarketMetadataProviderValue
      }
    >
      {children}
    </MarketMetadataContext.Provider>
  )
}

// Helper hook to access the provider values
const useMarketMetadata = (): MarketMetadataProviderValue =>
  useContext(MarketMetadataContext)

export { MarketMetadataProvider, useMarketMetadata, MarketMetadataContext }
export default MarketMetadataProvider
