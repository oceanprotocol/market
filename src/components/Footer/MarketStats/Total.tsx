import PriceUnit from '@shared/Price/PriceUnit'
import React, { ReactElement } from 'react'
import { StatsTotal } from './_types'

export default function MarketStatsTotal({
  total
}: {
  total: StatsTotal
}): ReactElement {
  return (
    <>
      <strong>{total.orders}</strong> orders across{' '}
      <strong>{total.nfts}</strong> assets with{' '}
      <strong>{total.datatokens}</strong> different datatokens.{' '}
      <PriceUnit price={total.veAllocated} symbol="veOCEAN" size="small" />{' '}
      allocated.{' '}
      <PriceUnit price={total.veLocked} symbol="OCEAN" size="small" /> locked.
    </>
  )
}
