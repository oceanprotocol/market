import React, { ReactElement } from 'react'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
import styles from './Actions.module.css'
import ExplorerLink from '@shared/ExplorerLink'
import SuccessConfetti from '@shared/SuccessConfetti'
import { useWeb3 } from '@context/Web3'
import TokenApproval from '@shared/TokenApproval'
import { getOceanConfig } from '@utils/ocean'
import { useAsset } from '@context/Asset'

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
  const { ddo } = useAsset()

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

  const config = getOceanConfig(ddo?.chainId)
  const tokenAddress = config.oceanTokenAddress
  const tokenSymbol = config.oceanTokenSymbol

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
