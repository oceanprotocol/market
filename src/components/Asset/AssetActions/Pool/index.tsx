import React, { ReactElement, useState } from 'react'
import styles from './index.module.css'
import stylesActions from './Actions.module.css'
import PriceUnit from '@shared/Price/PriceUnit'
import Button from '@shared/atoms/Button'
import Add from './Add'
import Remove from './Remove'
import Tooltip from '@shared/atoms/Tooltip'
import ExplorerLink from '@shared/ExplorerLink'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import Graph from './Graph'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import PoolTransactions from '@shared/PoolTransactions'
import Decimal from 'decimal.js'
import content from '../../../../../content/price.json'
import { usePool } from '@context/Pool'
import Token from './Token'
import PoolSection from './PoolSection'

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
    fetchAllData
    // refreshInterval
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
        />
      ) : showRemove ? (
        <Remove
          setShowRemove={setShowRemove}
          poolAddress={asset?.accessDetails?.addressOrId}
          poolTokens={poolInfoUser?.poolShares}
          totalPoolTokens={poolInfo?.totalPoolTokens}
          tokenOutAddress={poolInfo?.baseTokenAddress}
          tokenOutSymbol={poolInfo?.baseTokenSymbol}
        />
      ) : (
        <>
          <PoolSection className={styles.dataToken}>
            <PriceUnit
              price="1"
              symbol={poolInfo?.datatokenSymbol}
              size="large"
            />{' '}
            ={' '}
            <PriceUnit
              price={`${poolData?.spotPrice}`}
              symbol={poolInfo?.baseTokenSymbol}
              size="large"
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
          </PoolSection>

          <PoolSection
            title="Your Value Locked"
            titlePostfix={`${poolInfoUser?.poolShare}% of pool`}
            tooltip={content.pool.tooltips.liquidity.replace(
              'SWAPFEE',
              poolInfo?.liquidityProviderSwapFee
            )}
            highlight
          >
            <Token
              symbol={poolInfo?.baseTokenSymbol}
              balance={poolInfoUser?.liquidity.toString()}
              conversion={poolInfoUser?.liquidity}
            />
          </PoolSection>

          <PoolSection
            title="Owner Value Locked"
            titlePostfix={`${poolInfoOwner?.poolShare}% of pool`}
          >
            <Token
              symbol={poolInfo?.baseTokenSymbol}
              balance={poolInfoOwner?.liquidity.toString()}
              conversion={poolInfoOwner?.liquidity}
            />
          </PoolSection>

          <PoolSection title="Total Value Locked">
            <Token
              symbol={poolInfo?.baseTokenSymbol}
              balance={poolInfo?.totalLiquidityInOcean.toString()}
              conversion={poolInfo?.totalLiquidityInOcean}
            />
          </PoolSection>

          <PoolSection
            title="Pool Statistics"
            titlePostfix={
              poolInfo?.weightDt &&
              `${poolInfo?.weightBaseToken}/${poolInfo?.weightDt}`
            }
            titlePostfixTitle={`Weight of ${poolInfo?.weightBaseToken}% ${poolInfo?.baseTokenSymbol} & ${poolInfo?.weightDt}% ${poolInfo?.datatokenSymbol}`}
          >
            <Graph poolSnapshots={poolSnapshots} />

            <Token
              symbol={poolInfo?.baseTokenSymbol}
              balance={`${poolData?.baseTokenLiquidity}`}
              size="mini"
            />
            <Token
              symbol={poolInfo?.datatokenSymbol}
              balance={`${poolData?.datatokenLiquidity}`}
              size="mini"
            />

            <Token
              symbol="% pool fee"
              balance={poolInfo?.liquidityProviderSwapFee}
              noIcon
              size="mini"
            />
            <Token
              symbol="% market fee"
              balance={poolInfo?.publishMarketSwapFee}
              noIcon
              size="mini"
            />
            <Token
              symbol="% OPF fee"
              balance={poolInfo?.opcFee}
              noIcon
              size="mini"
            />
          </PoolSection>

          <div className={styles.update}>
            <Button style="text" size="small" onClick={() => fetchAllData()}>
              Refresh Data
            </Button>
            {/* Fetching every {refreshInterval / 1000} sec. */}
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
                poolChainId={asset?.chainId}
                minimal
              />
            </AssetActionHistoryTable>
          )}
        </>
      )}
    </>
  )
}
