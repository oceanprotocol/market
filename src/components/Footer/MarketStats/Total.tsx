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
      <PriceUnit price={total.orders} size="small" /> orders across{' '}
      <PriceUnit price={total.nfts} size="small" /> assets with{' '}
      <PriceUnit price={total.datatokens} size="small" /> different datatokens.
    </>
  )
}
