import { getSiteMetadata } from '@utils/siteConfig'
import { fetchData, getQueryContext } from '@utils/subgraph'
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { OpcQuery } from 'src/@types/subgraph/OpcQuery'
import { OperationResult } from 'urql'
import { opcQuery } from './_queries'
import {
  MarketMetadataProviderValue,
  OpcFee,
  SiteContent,
  AppConfig
} from './_types'

const MarketMetadataContext = createContext({} as MarketMetadataProviderValue)

function MarketMetadataProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [siteContent, setSiteContent] = useState<SiteContent>()
  const [appConfig, setAppConfig] = useState<AppConfig>()
  const [opcFees, setOpcFees] = useState<OpcFee[]>()

  useEffect(() => {
    const { siteContent, appConfig } = getSiteMetadata()
    setSiteContent(siteContent)
    setAppConfig(appConfig)
  }, [])

  useEffect(() => {
    async function getOpcData() {
      if (!appConfig) return
      const opcData = []
      for (let i = 0; i < appConfig.chainIdsSupported.length; i++) {
        const response: OperationResult<OpcQuery> = await fetchData(
          opcQuery,
          null,
          getQueryContext(appConfig.chainIdsSupported[i])
        )

        opcData.push({
          chainId: appConfig.chainIdsSupported[i],
          approvedTokens: response.data?.opc.approvedTokens,
          swapApprovedFee: response.data?.opc.swapOceanFee,
          swapNotApprovedFee: response.data.opc.swapNonOceanFee
        } as OpcFee)
      }
      setOpcFees(opcData)
    }
    getOpcData()
  }, [appConfig, appConfig?.chainIdsSupported])

  const getOpcFeeForToken = useCallback(
    (tokenAddress: string, chainId: number): string => {
      const opc = opcFees.filter((x) => x.chainId === chainId)[0]
      const isTokenApproved = opc.approvedTokens.includes(tokenAddress)
      return isTokenApproved ? opc.swapApprovedFee : opc.swapNotApprovedFee
    },
    [opcFees]
  )
  return (
    <MarketMetadataContext.Provider
      value={
        {
          opcFees,
          siteContent,
          appConfig,
          getOpcFeeForToken
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
