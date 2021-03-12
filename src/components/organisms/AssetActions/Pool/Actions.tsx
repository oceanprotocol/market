import React, { ReactElement } from 'react'
import Loader from '../../../atoms/Loader'
import Button from '../../../atoms/Button'
import styles from './Actions.module.css'
import ExplorerLink from '../../../atoms/ExplorerLink'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'

export default function Actions({
  isLoading,
  loaderMessage,
  successMessage,
  txId,
  actionName,
  action,
  isDisabled
}: {
  isLoading: boolean
  loaderMessage: string
  successMessage: string
  txId: string
  actionName: string
  action: () => void
  isDisabled?: boolean
}): ReactElement {
  const { networkId } = useWeb3()
  const { ocean } = useOcean()

  return (
    <>
      <div className={styles.actions}>
        {isLoading ? (
          <Loader message={loaderMessage} />
        ) : (
          <Button
            style="primary"
            size="small"
            onClick={() => action()}
            disabled={!ocean || isDisabled}
          >
            {actionName}
          </Button>
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
