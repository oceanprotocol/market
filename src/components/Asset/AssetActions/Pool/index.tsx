import React, { ReactElement, useState } from 'react'
import styles from './index.module.css'
import stylesActions from './Actions.module.css'
import PriceUnit from '@shared/Price/PriceUnit'
import Button from '@shared/atoms/Button'
import Add from './Add'
import Remove from './Remove'
import Tooltip from '@shared/atoms/Tooltip'
import ExplorerLink from '@shared/ExplorerLink'
import TokenList from './TokenList'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import Graph from './Graph'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import PoolTransactions from '@shared/PoolTransactions'
import Decimal from 'decimal.js'
import content from '../../../../../content/price.json'
import { usePool } from '@context/Pool'

export default function Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { isInPurgatory, asset, isAssetNetwork } = useAsset()
  const {
    poolData,
    poolInfo,
    poolInfoUser,
    poolInfoOwner,
    poolSnapshots,
    hasUserAddedLiquidity,
    isRemoveDisabled,
    refreshInterval,
    fetchAllData
  } = usePool()

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)

  return (
    <>
      {showAdd ? (
        <Add
          setShowAdd={setShowAdd}
          poolAddress={asset?.accessDetails?.addressOrId}
          totalPoolTokens={poolInfo?.totalPoolTokens}
          totalBalance={{
            baseToken: new Decimal(poolData?.baseTokenLiquidity).toString(),
            datatoken: new Decimal(poolData?.datatokenLiquidity).toString()
          }}
          swapFee={poolInfo?.liquidityProviderSwapFee}
          datatokenSymbol={poolInfo?.datatokenSymbol}
          tokenInAddress={poolInfo?.baseTokenAddress}
          tokenInSymbol={poolInfo?.baseTokenSymbol}
          fetchAllData={fetchAllData}
        />
      ) : showRemove ? (
        <Remove
          setShowRemove={setShowRemove}
          poolAddress={asset?.accessDetails?.addressOrId}
          poolTokens={poolInfoUser?.poolShares}
          totalPoolTokens={poolInfo?.totalPoolTokens}
          tokenOutAddress={poolInfo?.baseTokenAddress}
          tokenOutSymbol={poolInfo?.baseTokenSymbol}
          fetchAllData={fetchAllData}
        />
      ) : (
        <>
          <div className={styles.dataToken}>
            <PriceUnit price="1" symbol={poolInfo?.datatokenSymbol} /> ={' '}
            <PriceUnit
              price={`${poolData?.spotPrice}`}
              symbol={poolInfo?.baseTokenSymbol}
            />
            <Tooltip content={content.pool.tooltips.price} />
            <div className={styles.dataTokenLinks}>
              <ExplorerLink
                networkId={asset?.chainId}
                path={`address/${asset?.accessDetails?.addressOrId}`}
              >
                Pool
              </ExplorerLink>
              <ExplorerLink
                networkId={asset?.chainId}
                path={
                  asset?.chainId === 2021000 || asset?.chainId === 1287
                    ? `tokens/${asset?.services[0].datatokenAddress}`
                    : `token/${asset?.services[0].datatokenAddress}`
                }
              >
                Datatoken
              </ExplorerLink>
            </div>
          </div>

          <TokenList
            title={
              <>
                Your Liquidity
                <Tooltip
                  content={content.pool.tooltips.liquidity.replace(
                    'SWAPFEE',
                    poolInfo?.liquidityProviderSwapFee
                  )}
                />
                {poolInfoUser?.poolShare && (
                  <span className={styles.titleInfo}>
                    {poolInfoUser?.poolShare}% of pool
                  </span>
                )}
              </>
            }
            baseTokenValue={poolInfoUser?.liquidity.toString()}
            baseTokenSymbol={poolInfo?.baseTokenSymbol}
            conversion={poolInfoUser?.liquidity}
            highlight
          />

          <TokenList
            title={
              <>
                Owner Liquidity
                <span className={styles.titleInfo}>
                  {poolInfoOwner?.poolShare}% of pool
                </span>
              </>
            }
            baseTokenValue={poolInfoOwner?.liquidity.toString()}
            baseTokenSymbol={poolInfo?.baseTokenSymbol}
            conversion={poolInfoOwner?.liquidity}
          />

          <TokenList
            title={
              <>
                Pool Statistics
                {poolInfo?.weightDt && (
                  <span
                    className={styles.titleInfo}
                    title={`Weight of ${poolInfo?.weightBaseToken}% ${poolInfo?.baseTokenSymbol} & ${poolInfo?.weightDt}% ${poolInfo?.datatokenSymbol}`}
                  >
                    {poolInfo?.weightBaseToken}/{poolInfo?.weightDt}
                  </span>
                )}
                <Graph poolSnapshots={poolSnapshots} />
              </>
            }
            baseTokenValue={`${poolData?.baseTokenLiquidity}`}
            baseTokenSymbol={poolInfo?.baseTokenSymbol}
            datatokenValue={`${poolData?.datatokenLiquidity}`}
            datatokenSymbol={poolInfo?.datatokenSymbol}
            conversion={poolInfo?.totalLiquidityInOcean}
          >
            {/* <Token symbol="% pool fee" balance={poolInfo?.poolFee} noIcon />
            <Token symbol="% market fee" balance={poolInfo?.marketFee} noIcon />
            <Token symbol="% OPF fee" balance={poolInfo?.opfFee} noIcon /> */}
          </TokenList>

          <div className={styles.update}>
            Fetching every {refreshInterval / 1000} sec.
          </div>

          <div className={stylesActions.actions}>
            <Button
              style="primary"
              size="small"
              onClick={() => setShowAdd(true)}
              disabled={isInPurgatory}
            >
              Add Liquidity
            </Button>

            {hasUserAddedLiquidity && !isRemoveDisabled && (
              <Button
                size="small"
                onClick={() => setShowRemove(true)}
                disabled={!isAssetNetwork}
              >
                Remove
              </Button>
            )}
          </div>

          {accountId && (
            <AssetActionHistoryTable title="Your Pool Transactions">
              <PoolTransactions
                accountId={accountId}
                poolAddress={asset?.accessDetails?.addressOrId}
                poolChainId={[asset?.chainId]}
                minimal
              />
            </AssetActionHistoryTable>
          )}
        </>
      )}
    </>
  )
}
