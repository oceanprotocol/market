import React, { ReactElement } from 'react'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import Tooltip from '@shared/atoms/Tooltip'
import content from '../../../../content/price.json'

export function ButtonApprove({
  amount,
  tokenSymbol,
  approveTokens,
  isLoading
}: {
  amount: string
  tokenSymbol: string
  approveTokens: (amount: string) => void
  isLoading: boolean
}): ReactElement {
  const { infiniteApproval } = useUserPreferences()

  return isLoading ? (
    <Loader message={`Approving ${tokenSymbol}...`} />
  ) : infiniteApproval ? (
    <Button
      style="primary"
      size="small"
      disabled={parseInt(amount) < 1}
      onClick={() => approveTokens(`${2 ** 53 - 1}`)}
    >
      Approve {tokenSymbol}{' '}
      <Tooltip
        content={content.pool.tooltips.approveInfinite.replace(
          'COIN',
          tokenSymbol
        )}
      />
    </Button>
  ) : (
    <Button style="primary" size="small" onClick={() => approveTokens(amount)}>
      Approve {amount} {tokenSymbol}
      <Tooltip
        content={content.pool.tooltips.approveSpecific.replace(
          'COIN',
          tokenSymbol
        )}
      />
    </Button>
  )
}
