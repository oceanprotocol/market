import React, { ReactElement } from 'react'
import Conversion from '@shared/Price/Conversion'
import PriceUnit from '@shared/Price/PriceUnit'
import { StatsTotal } from './_types'
import { useUserPreferences } from '@context/UserPreferences'

export default function MarketStatsTotal({
  total
}: {
  total: StatsTotal
}): ReactElement {
  const { locale } = useUserPreferences()
  return (
    <>
      <p>
        <strong>{total.orders}</strong> orders across{' '}
        <strong>{total.nfts}</strong> assets with{' '}
        <strong>{total.datatokens}</strong> different datatokens.
      </p>
      <Conversion
        price={`${total.totalValueLockedInOcean}`}
        hideApproximateSymbol
        locale={locale}
      />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{total.pools}</strong> asset pools that contain{' '}
      <PriceUnit
        price={`${total.totalOceanLiquidity}`}
        symbol="OCEAN"
        size="small"
        locale={locale}
      />
      , plus datatokens for each pool.
    </>
  )
}
