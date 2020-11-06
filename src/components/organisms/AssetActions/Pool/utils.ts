import { Ocean } from '@oceanprotocol/lib'

export async function getMaxPercentRemove(
  ocean: Ocean,
  poolAddress: string,
  poolTokens: string
): Promise<string> {
  const amountMaxOcean = await ocean.pool.getOceanMaxRemoveLiquidity(
    poolAddress
  )

  const amountMaxPoolShares = await ocean.pool.getPoolSharesRequiredToRemoveOcean(
    poolAddress,
    amountMaxOcean
  )

  let amountMaxPercent = `${Math.floor(
    (Number(amountMaxPoolShares) / Number(poolTokens)) * 100
  )}`
  if (Number(amountMaxPercent) > 100) {
    amountMaxPercent = '100'
  }

  return amountMaxPercent
}
