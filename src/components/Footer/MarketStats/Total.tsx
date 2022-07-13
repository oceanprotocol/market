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
      <strong>{total.datatokens}</strong> different datatokens.
    </>
  )
}
