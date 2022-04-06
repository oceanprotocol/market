import { calcMaxExactOut } from '@oceanprotocol/lib'
import Decimal from 'decimal.js'

export async function getMax(poolTokens: string, totalPoolTokens: string) {
  const poolTokensAmount = !poolTokens || poolTokens === '0' ? '1' : poolTokens
  const maxTokensToRemoveFromPool = calcMaxExactOut(totalPoolTokens)
  const poolTokensDecimal = new Decimal(poolTokensAmount)
  const maxTokensToRemoveForUser = maxTokensToRemoveFromPool.greaterThan(
    poolTokensDecimal
  )
    ? poolTokensDecimal
    : maxTokensToRemoveFromPool

  const maxPercent = new Decimal(100)
    .mul(maxTokensToRemoveForUser)
    .div(poolTokensDecimal)

  return maxPercent.toDecimalPlaces(0, Decimal.ROUND_DOWN).toString()
}
