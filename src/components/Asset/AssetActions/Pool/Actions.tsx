import React, { ReactElement } from 'react'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
import styles from './Actions.module.css'
import ExplorerLink from '@shared/ExplorerLink'
import SuccessConfetti from '@shared/SuccessConfetti'
import { useWeb3 } from '@context/Web3'
import TokenApproval from '@shared/TokenApproval'

export default function Actions({
  isLoading,
  loaderMessage,
  successMessage,
  txId,
  actionName,
  amount,
  action,
  isDisabled,
  tokenAddress,
  tokenSymbol
}: {
  isLoading: boolean
  loaderMessage: string
  successMessage: string
  txId: string
  actionName: string
  amount?: string
  action: () => void
  isDisabled?: boolean
  tokenAddress: string
  tokenSymbol: string
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

  return (
    <>
      <div className={styles.actions}>
        {isLoading ? (
          <Loader message={loaderMessage} />
        ) : actionName === 'Supply' || actionName === 'Swap' ? (
          <TokenApproval
            actionButton={actionButton}
            amount={amount}
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            disabled={isDisabled}
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
