import { Ocean } from '@oceanprotocol/lib'

export async function getMaxValuesRemove(
  ocean: Ocean,
  poolAddress: string,
  poolTokens: string,
  amountPoolShares: string
): Promise<{ amountMaxPercent: string; amountOcean: string }> {
  const amountMaxOcean = await ocean.pool.getOceanMaxRemoveLiquidity(
    poolAddress
  )

  const amountMaxPoolShares = await ocean.pool.getPoolSharesRequiredToRemoveOcean(
    poolAddress,
    amountMaxOcean
  )

  const amountMaxPercent = `${Math.floor(
    (Number(amountMaxPoolShares) / Number(poolTokens)) * 100
  )}`

  const amountOcean = await ocean.pool.getOceanRemovedforPoolShares(
    poolAddress,
    amountPoolShares
  )

  return { amountMaxPercent, amountOcean }
}
