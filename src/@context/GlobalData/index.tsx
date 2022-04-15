import { useSiteMetadata } from '@hooks/useSiteMetadata'
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
import { GlobalDataProviderValue, OpcValue } from './_types'

const GlobalDataContext = createContext({} as GlobalDataProviderValue)

function GlobalDataProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const [opcValues, setOpcValues] = useState<OpcValue[]>()

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
          approvedTokens: response.data?.opc.approvedTokens,
          swapApprovedFee: response.data?.opc.swapOceanFee,
          swapNotApprovedFee: response.data.opc.swapNonOceanFee
        } as OpcValue)
      }
      setOpcValues(opcData)
    }
    getOpcData()
  }, [appConfig.chainIdsSupported])

  const getOpcForToken = useCallback(
    (tokenAddress: string, chainId: number): string => {
      const opc = opcValues.filter((x) => x.chainId === chainId)[0]
      const isTokenApproved = opc.approvedTokens.includes(tokenAddress)
      return isTokenApproved ? opc.swapApprovedFee : opc.swapNotApprovedFee
    },
    [opcValues]
  )
  return (
    <GlobalDataContext.Provider
      value={
        {
          opcValues,
          getOpcForToken
        } as GlobalDataProviderValue
      }
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

// Helper hook to access the provider values
const useGlobalData = (): GlobalDataProviderValue =>
  useContext(GlobalDataContext)

export { GlobalDataProvider, useGlobalData, GlobalDataContext }
export default GlobalDataProvider
