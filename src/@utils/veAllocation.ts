import { AllLocked } from 'src/@types/subgraph/AllLocked'
import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from './subgraph'
import axios from 'axios'
import networkdata from '../../content/networks-metadata.json'
import {
  getNetworkDataById,
  getNetworkType,
  NetworkType
} from '@hooks/useNetworkMetadata'
const AllLocked = gql`
  query AllLocked {
    veOCEANs(first: 1000) {
      lockedAmount
    }
  }
`

interface TotalVe {
  totalLocked: number
  totalAllocated: number
}

export function getVeChainNetworkId(assetNetworkId: number): number {
  const networkData = getNetworkDataById(networkdata, assetNetworkId)
  const networkType = getNetworkType(networkData)
  if (networkType === NetworkType.Mainnet) return 1
  else return 5
}

export async function getTotalAllocatedAndLocked(): Promise<TotalVe> {
  const totals = {
    totalLocked: 0,
    totalAllocated: 0
  }

  const queryContext = getQueryContext(1)

  const response = await axios.post(`https://df-sql.oceandao.org/nftinfo`)
  totals.totalAllocated = response.data?.reduce(
    (previousValue: number, currentValue: { ve_allocated: any }) =>
      previousValue + Number(currentValue.ve_allocated),
    0
  )

  const fetchedLocked: OperationResult<AllLocked, any> = await fetchData(
    AllLocked,
    null,
    queryContext
  )
  totals.totalLocked = fetchedLocked.data?.veOCEANs.reduce(
    (previousValue, currentValue) =>
      previousValue + Number(currentValue.lockedAmount),
    0
  )
  return totals
}
