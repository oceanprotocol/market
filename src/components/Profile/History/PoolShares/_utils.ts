import { getAssetsFromDtList } from '@utils/aquarius'
import { calculateUserLiquidity } from '@utils/pool'
import { CancelToken } from 'axios'
import { PoolShares_poolShares as PoolShare } from '../../../../@types/subgraph/PoolShares'
import { AssetPoolShare } from '.'

export async function getPoolSharesAssets(
  data: PoolShare[],
  chainIds: number[],
  cancelToken: CancelToken
) {
  if (data.length < 1) return []

  const assetList: AssetPoolShare[] = []
  const dtList: string[] = []

  for (let i = 0; i < data.length; i++) {
    dtList.push(data[i].pool.datatoken.address)
  }
  const ddoList = await getAssetsFromDtList(dtList, chainIds, cancelToken)

  for (let i = 0; i < data.length; i++) {
    const userLiquidity = calculateUserLiquidity(
      data[i].shares,
      data[i].pool.totalShares,
      data[i].pool.baseTokenLiquidity
    )
    assetList.push({
      poolShare: data[i],
      userLiquidity,
      networkId: ddoList[i].chainId,
      createTime: data[i].pool.createdTimestamp,
      asset: ddoList[i]
    })
  }
  const assets = assetList.sort((a, b) => b.createTime - a.createTime)
  return assets
}
