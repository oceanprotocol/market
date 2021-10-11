import React, { ReactElement } from 'react'
import Loader from '../../../atoms/Loader'
import Button from '../../../atoms/Button'
import styles from './Actions.module.css'
import ExplorerLink from '../../../atoms/ExplorerLink'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import TokenApproval from '../../../molecules/TokenApproval'

export default function Actions({
  isLoading,
  loaderMessage,
  successMessage,
  txId,
  actionName,
  amount,
  coin,
  action,
  isDisabled
}: {
  isLoading: boolean
  loaderMessage: string
  successMessage: string
  txId: string
  actionName: string
  amount?: string
  coin?: string
  action: () => void
  isDisabled?: boolean
}): ReactElement {
  const { networkId } = useWeb3()
  const { ocean } = useOcean()

  const actionButton = (
    <Button
      style="primary"
      size="small"
      onClick={() => action()}
      disabled={!ocean || isDisabled}
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
            coin={coin}
            disabled={!ocean || isDisabled}
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
