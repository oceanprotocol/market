import React, { ReactElement } from 'react'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import Tooltip from '@shared/atoms/Tooltip'
import content from '../../../../content/price.json'

export function ButtonApprove({
  amount,
  coin,
  approveTokens,
  isLoading
}: {
  amount: string
  coin: string
  approveTokens: (amount: string) => void
  isLoading: boolean
}): ReactElement {
  const { infiniteApproval } = useUserPreferences()

  return isLoading ? (
    <Loader message={`Approving ${coin}...`} />
  ) : infiniteApproval ? (
    <Button
      style="primary"
      size="small"
      disabled={parseInt(amount) < 1}
      onClick={() => approveTokens(`${2 ** 53 - 1}`)}
    >
      Approve {coin}{' '}
      <Tooltip
        content={content.pool.tooltips.approveInfinite.replace('COIN', coin)}
      />
    </Button>
  ) : (
    <Button style="primary" size="small" onClick={() => approveTokens(amount)}>
      Approve {amount} {coin}
      <Tooltip
        content={content.pool.tooltips.approveSpecific.replace('COIN', coin)}
      />
    </Button>
  )
}
