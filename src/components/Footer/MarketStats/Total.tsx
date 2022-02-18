import React, { ReactElement } from 'react'
import Conversion from '@shared/Price/Conversion'
import PriceUnit from '@shared/Price/PriceUnit'
import styles from './index.module.css'

export default function MarketStatsTotal({
  totalValueLocked,
  poolCount,
  totalOceanLiquidity
}: {
  totalValueLocked: string
  poolCount: string
  totalOceanLiquidity: string
}): ReactElement {
  return (
    <>
      <Conversion price={totalValueLocked} hideApproximateSymbol />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{poolCount}</strong> asset pools that contain{' '}
      <PriceUnit price={totalOceanLiquidity} symbol="OCEAN" small />, plus
      datatokens for each pool.
    </>
  )
}
