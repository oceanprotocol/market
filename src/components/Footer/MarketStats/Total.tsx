import React, { ReactElement } from 'react'
import Conversion from '@shared/Price/Conversion'
import PriceUnit from '@shared/Price/PriceUnit'

export default function MarketStatsTotal({
  totalValueLockedInOcean,
  poolCount,
  nftCount,
  datatokenCount,
  orderCount,
  totalOceanLiquidity
}: {
  totalValueLockedInOcean: string
  poolCount: string
  nftCount: string
  datatokenCount: string
  orderCount: string
  totalOceanLiquidity: string
}): ReactElement {
  return (
    <>
      <p>
        <strong>{orderCount}</strong> orders across <strong>{nftCount}</strong>{' '}
        Data NFTs with <strong>{datatokenCount}</strong> different datatokens.
      </p>
      <Conversion price={totalValueLockedInOcean} hideApproximateSymbol />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{poolCount}</strong> asset pools that contain{' '}
      <PriceUnit price={totalOceanLiquidity} symbol="OCEAN" small />, plus
      datatokens for each pool.
    </>
  )
}
