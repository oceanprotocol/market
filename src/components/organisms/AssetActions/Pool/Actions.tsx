import React, { ReactElement } from 'react'
import Loader from '../../../atoms/Loader'
import Button from '../../../atoms/Button'
import styles from './Actions.module.css'
import EtherscanLink from '../../../atoms/EtherscanLink'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import { useOcean } from '@oceanprotocol/react'

export default function Actions({
  isLoading,
  loaderMessage,
  successMessage,
  txId,
  actionName,
  action
}: {
  isLoading: boolean
  loaderMessage: string
  successMessage: string
  txId: string
  actionName: string
  action: () => void
}): ReactElement {
  const { networkId, ocean } = useOcean()

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
            disabled={!ocean}
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
            <EtherscanLink networkId={networkId} path={`/tx/${txId}`}>
              See on Etherscan
            </EtherscanLink>
          }
        />
      )}
    </>
  )
}
