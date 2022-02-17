import React, { ReactElement } from 'react'
import Conversion from '@shared/Price/Conversion'
import PriceUnit from '@shared/Price/PriceUnit'
import NetworkName from '@shared/NetworkName'
import styles from './Tooltip.module.css'
import { StatsValue } from './index'

export default function MarketStatsTooltip({
  totalValueLocked,
  poolCount,
  totalOceanLiquidity,
  mainChainIds
}: {
  totalValueLocked: StatsValue
  poolCount: StatsValue
  totalOceanLiquidity: StatsValue
  mainChainIds: number[]
}): ReactElement {
  return (
    <>
      <ul className={styles.statsList}>
        {totalValueLocked &&
          totalOceanLiquidity &&
          poolCount &&
          mainChainIds?.map((chainId, key) => (
            <li className={styles.tooltipStats} key={key}>
              <NetworkName networkId={chainId} className={styles.network} />
              <br />
              <Conversion
                price={totalValueLocked[chainId] || '0'}
                hideApproximateSymbol
              />{' '}
              <abbr title="Total Value Locked">TVL</abbr>
              {' | '}
              <strong>{poolCount[chainId] || '0'}</strong> pools
              {' | '}
              <PriceUnit price={totalOceanLiquidity[chainId] || '0'} small />
            </li>
          ))}
      </ul>
      <p className={styles.note}>
        Counted on-chain from our pool factory. Does not filter out assets in{' '}
        <a href="https://github.com/oceanprotocol/list-purgatory">
          list-purgatory
        </a>
      </p>
    </>
  )
}
