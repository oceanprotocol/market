import React, { ReactElement } from 'react'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
import styles from './Actions.module.css'
import ExplorerLink from '@shared/ExplorerLink'
import SuccessConfetti from '@shared/SuccessConfetti'
import { useWeb3 } from '@context/Web3'
import TokenApproval from '@shared/TokenApproval'
import Decimal from 'decimal.js'

export default function Actions({
  isLoading,
  loaderMessage,
  successMessage,
  slippage,
  txId,
  actionName,
  amount,
  action,
  isDisabled,
  tokenAddress,
  tokenSymbol,
  setSubmitting
}: {
  isLoading: boolean
  loaderMessage: string
  successMessage: string
  slippage?: string
  txId: string
  actionName: string
  amount?: string
  action: () => void
  isDisabled?: boolean
  tokenAddress: string
  tokenSymbol: string
  setSubmitting?: (isSubmitting: boolean) => void
}): ReactElement {
  const { networkId } = useWeb3()

  const actionButton = (
    <Button
      style="primary"
      size="small"
      onClick={() => action()}
      disabled={isDisabled}
    >
      {actionName}
    </Button>
  )

  const applySlippage = (amount: string) => {
    if (!amount) return '0'
    const newAmount = new Decimal(amount)
      .mul(
        new Decimal(1)
          .plus(new Decimal(slippage).div(new Decimal(100)))
          .toString()
      )
      .toString()
    return newAmount
  }

  return (
    <>
      <div className={styles.actions}>
        {isLoading ? (
          <Loader message={loaderMessage} />
        ) : actionName === 'Supply' || actionName === 'Swap' ? (
          <TokenApproval
            actionButton={actionButton}
            amount={slippage ? applySlippage(amount) : amount}
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            disabled={isDisabled}
            setSubmitting={setSubmitting}
          />
        ) : (
          actionButton
        )}
      </div>
      {txId && (
        <SuccessConfetti
          className={styles.success}
          success={successMessage}
          action={
            <ExplorerLink networkId={networkId} path={`/tx/${txId}`}>
              View transaction
            </ExplorerLink>
          }
        />
      )}
    </>
  )
}
