import React, { ReactElement } from 'react'
import Conversion from '@shared/Price/Conversion'
import PriceUnit from '@shared/Price/PriceUnit'
import NetworkName from '@shared/NetworkName'
import styles from './Tooltip.module.css'
import { StatsValue } from './_types'

export default function MarketStatsTooltip({
  totalValueLockedInOcean,
  poolCount,
  totalOceanLiquidity,
  mainChainIds
}: {
  totalValueLockedInOcean: StatsValue
  poolCount: StatsValue
  totalOceanLiquidity: StatsValue
  mainChainIds: number[]
}): ReactElement {
  return (
    <>
      <ul className={styles.statsList}>
        {totalValueLockedInOcean &&
          totalOceanLiquidity &&
          poolCount &&
          mainChainIds?.map((chainId, key) => (
            <li className={styles.tooltipStats} key={key}>
              <NetworkName networkId={chainId} className={styles.network} />
              <br />
              <Conversion
                price={totalValueLockedInOcean[chainId] || '0'}
                hideApproximateSymbol
              />{' '}
              <abbr title="Total Value Locked">TVL</abbr>
              {' | '}
              <strong>{poolCount[chainId] || '0'}</strong> pools
              {' | '}
              <PriceUnit
                price={totalOceanLiquidity[chainId] || '0'}
                symbol="OCEAN"
                small
              />
            </li>
          ))}
      </ul>
      <p className={styles.note}>
        Counted on-chain from our NFT and pool factories. Does not filter out
        assets in{' '}
        <a href="https://github.com/oceanprotocol/list-purgatory">
          list-purgatory
        </a>
      </p>
    </>
  )
}
