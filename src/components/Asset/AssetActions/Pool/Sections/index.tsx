import { useAsset } from '@context/Asset'
import { usePool } from '@context/Pool'
import Tooltip from '@shared/atoms/Tooltip'
import ExplorerLink from '@shared/ExplorerLink'
import PriceUnit from '@shared/Price/PriceUnit'
import React from 'react'
import Graph from '../Graph'
import PoolSection from '../Section'
import Token from '../../../../@shared/Token'
import content from '../../../../../../content/price.json'
import styles from './index.module.css'
import Update from './Update'

export default function PoolSections() {
  const { asset } = useAsset()
  const { poolData, poolInfo, poolInfoUser, poolInfoOwner } = usePool()

  return (
    <>
      <PoolSection className={styles.dataToken}>
        <PriceUnit price="1" symbol={poolInfo?.datatokenSymbol} size="large" />{' '}
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
        title="Your liquidity"
        titlePostfix={
          poolInfoUser?.poolSharePercentage &&
          `${poolInfoUser?.poolSharePercentage}% of pool`
        }
        tooltip={content.pool.tooltips.liquidity.replace(
          'SWAPFEE',
          poolInfo?.liquidityProviderSwapFee
        )}
        highlight
      >
        <Token
          symbol={poolInfo?.baseTokenSymbol}
          balance={poolInfoUser?.liquidity}
          conversion
        />
      </PoolSection>

      <PoolSection
        title="Owner liquidity"
        titlePostfix={`${poolInfoOwner?.poolSharePercentage}% of pool`}
      >
        <Token
          symbol={poolInfo?.baseTokenSymbol}
          balance={poolInfoOwner?.liquidity}
          conversion
        />
      </PoolSection>

      <PoolSection title="Total Value Locked">
        <Token
          symbol={poolInfo?.baseTokenSymbol}
          balance={poolData?.baseTokenLiquidity.toString()}
          conversion
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
        <Graph />
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
          symbol="% swap fee"
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
          symbol="% OPC fee"
          balance={poolInfo?.opcFee}
          noIcon
          size="mini"
        />
      </PoolSection>

      <Update />
    </>
  )
}
