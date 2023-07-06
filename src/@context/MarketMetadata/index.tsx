import React, {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { OpcQuery } from '../../../src/@types/subgraph/OpcQuery'
import { OperationResult } from 'urql'
import { opcQuery } from './_queries'
import { MarketMetadataProviderValue, OpcFee } from './_types'
import siteContent from '../../../content/site.json'
import appConfig from '../../../app.config'
import {
  fetchData,
  getQueryContext,
  getOpcsApprovedTokens
} from '@utils/subgraph'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useNetwork, useConnect } from 'wagmi'

const MarketMetadataContext = createContext({} as MarketMetadataProviderValue)

function MarketMetadataProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { isLoading } = useConnect()
  const { chain } = useNetwork()

  const [opcFees, setOpcFees] = useState<OpcFee[]>()
  const [approvedBaseTokens, setApprovedBaseTokens] = useState<TokenInfo[]>()

  useEffect(() => {
    async function getOpcData() {
      const opcData = []
      for (let i = 0; i < appConfig.chainIdsSupported.length; i++) {
        const response: OperationResult<OpcQuery> = await fetchData(
          opcQuery,
          null,
          getQueryContext(appConfig.chainIdsSupported[i])
        )
        opcData.push({
          chainId: appConfig.chainIdsSupported[i],
          approvedTokens: response.data?.opc?.approvedTokens?.map(
            (token) => token.address
          ),
          swapApprovedFee: response.data?.opc?.swapOceanFee,
          swapNotApprovedFee: response.data?.opc?.swapNonOceanFee
        } as OpcFee)
      }
      LoggerInstance.log('[MarketMetadata] Got new data.', {
        opcFees: opcData,
        siteContent,
        appConfig
      })
      setOpcFees(opcData)
    }
    getOpcData()
  }, [])

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
  const getApprovedBaseTokens = useCallback(async (chainId: number) => {
    try {
      const approvedTokensList = await getOpcsApprovedTokens(chainId)
      setApprovedBaseTokens(approvedTokensList)
      LoggerInstance.log(
        '[MarketMetadata] Approved baseTokens',
        approvedTokensList
      )
    } catch (error) {
      LoggerInstance.error('[MarketMetadata] Error: ', error.message)
    }
  }, [])

  useEffect(() => {
    if (isLoading) return
    getApprovedBaseTokens(chain?.id || 1)
  }, [chain?.id, getApprovedBaseTokens, isLoading])

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
