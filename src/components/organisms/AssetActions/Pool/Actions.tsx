import React, { ReactElement } from 'react'
import Loader from '../../../atoms/Loader'
import Button from '../../../atoms/Button'
import styles from './Actions.module.css'
import EtherscanLink from '../../../atoms/EtherscanLink'
import SuccessConfetti from '../../../atoms/SuccessConfetti'

export default function Actions({
  isLoading,
  loaderMessage,
  txId,
  actionName,
  action
}: {
  isLoading: boolean
  loaderMessage: string
  txId: string
  actionName: string
  action: () => void
}): ReactElement {
  return (
    <>
      <div className={styles.actions}>
        {isLoading ? (
          <Loader message={loaderMessage} />
        ) : (
          <Button style="primary" size="small" onClick={() => action()}>
            {actionName}
          </Button>
        )}
      </div>
      {txId && (
        <SuccessConfetti
          success="Successfully added liquidity."
          action={
            <EtherscanLink network="rinkeby" path={`/tx/${txId}`}>
              See on Etherscan
            </EtherscanLink>
          }
        />
      )}
    </>
  )
}
