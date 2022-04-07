import { PoolInfo, PoolInfoUser } from '@context/Pool/_types'
import { calcMaxExactOut, Pool } from '@oceanprotocol/lib'
import Decimal from 'decimal.js'
// eslint-disable-next-line camelcase
import { PoolData_poolData } from 'src/@types/subgraph/PoolData'

export async function getMax(
  poolInstance: Pool,
  poolInfo: PoolInfo,
  poolInfoUser: PoolInfoUser,
  // eslint-disable-next-line camelcase
  poolData: PoolData_poolData
) {
  // calcPoolInGivenSingleOut

  const maxBaseTokensRemovable = calcMaxExactOut(poolData.baseTokenLiquidity)

  const maxPoolSharesRemovable = await poolInstance.calcPoolInGivenSingleOut(
    poolData.id,
    poolInfo.baseTokenAddress,
    maxBaseTokensRemovable.toString()
  )

  const userPoolShares = poolInfoUser.poolShares

  const maxPoolSharesRemovableDecimal = new Decimal(maxPoolSharesRemovable)
  const userPoolSharesDecimal = new Decimal(userPoolShares)

  const maxPoolSharesRemovableByUser =
    maxPoolSharesRemovableDecimal.greaterThan(userPoolSharesDecimal)
      ? userPoolSharesDecimal
      : maxPoolSharesRemovableDecimal

  // small hack because if the values are equal the decimal.js result is 99.(9)
  const maxPercent = maxPoolSharesRemovableByUser.equals(userPoolSharesDecimal)
    ? new Decimal(100)
    : new Decimal(100)
        .mul(maxPoolSharesRemovableByUser)
        .div(userPoolSharesDecimal)

  return maxPercent.toDecimalPlaces(0, Decimal.ROUND_DOWN).toString()
}
