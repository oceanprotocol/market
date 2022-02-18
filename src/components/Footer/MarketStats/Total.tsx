import React, { ReactElement } from 'react'
import Conversion from '@shared/Price/Conversion'
import PriceUnit from '@shared/Price/PriceUnit'
import { StatsTotal } from './_types'

export default function MarketStatsTotal({
  total
}: {
  total: StatsTotal
}): ReactElement {
  return (
    <>
      <p>
        <strong>{total.orders}</strong> orders across{' '}
        <strong>{total.nfts}</strong> Data NFTs with{' '}
        <strong>{total.datatokens}</strong> different datatokens.
      </p>
      <Conversion
        price={`${total.totalValueLockedInOcean}`}
        hideApproximateSymbol
      />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{total.pools}</strong> asset pools that contain{' '}
      <PriceUnit price={`${total.totalOceanLiquidity}`} symbol="OCEAN" small />,
      plus datatokens for each pool.
    </>
  )
}
