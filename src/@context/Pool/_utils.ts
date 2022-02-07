import { isValidNumber } from '@utils/numbers'
import { getQueryContext, fetchData } from '@utils/subgraph'
import Decimal from 'decimal.js'
import { PoolData } from 'src/@types/subgraph/PoolData'
import { OperationResult } from 'urql'
import { poolDataQuery } from './_queries'

export async function getPoolData(
  chainId: number,
  pool: string,
  owner: string,
  user: string
) {
  const queryVariables = {
    // Using `pool` & `poolAsString` is a workaround to make the mega query work.
    // See https://github.com/oceanprotocol/ocean-subgraph/issues/301
    pool: pool.toLowerCase(),
    poolAsString: pool.toLowerCase(),
    owner: owner.toLowerCase(),
    user: user.toLowerCase()
  }

  const response: OperationResult<PoolData> = await fetchData(
    poolDataQuery,
    queryVariables,
    getQueryContext(chainId)
  )
  return response?.data
}

export function getWeight(weight: string) {
  return isValidNumber(weight) ? new Decimal(weight).mul(10).toString() : '0'
}

export function getFee(fee: string) {
  // fees are tricky: to get 0.1% you need to convert from 0.001
  return isValidNumber(fee) ? new Decimal(fee).mul(100).toString() : '0'
}
