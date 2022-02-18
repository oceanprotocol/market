import React, { ReactElement } from 'react'
import Conversion from '@shared/Price/Conversion'
import PriceUnit from '@shared/Price/PriceUnit'

export default function MarketStatsTotal({
  totalValueLockedInOcean,
  poolCount,
  nftCount,
  orderCount,
  totalOceanLiquidity
}: {
  totalValueLockedInOcean: string
  poolCount: string
  nftCount: string
  orderCount: string
  totalOceanLiquidity: string
}): ReactElement {
  return (
    <>
      <strong>{orderCount}</strong> orders across <strong>{nftCount}</strong>{' '}
      Data NFTs.
      <Conversion price={totalValueLockedInOcean} hideApproximateSymbol />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{poolCount}</strong> asset pools holding{' '}
      <PriceUnit price={totalOceanLiquidity} symbol="OCEAN" small />.
    </>
  )
}
