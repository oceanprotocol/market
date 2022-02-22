import ExplorerLink from '@shared/ExplorerLink'
import React from 'react'
import styles from './TransactionCount.module.css'
import Conversion from '@shared/Price/Conversion'
import Tooltip from '@shared/atoms/Tooltip'
import { usePrices } from '@context/Prices'
import web3 from 'web3'

export default function TransactionCount({
  txCount,
  chainId,
  txHash,
  gasFees
}: {
  txCount: number
  chainId: number
  txHash: string
  gasFees?: string
}) {
  const { prices } = usePrices()
  let gasFeeBase = '0'
  if (gasFees) {
    gasFeeBase = (+gasFees * +(prices as any)?.eth).toString()
    gasFeeBase = parseFloat(gasFeeBase).toPrecision(10).toString()
  }
  const gasFeeWei = web3.utils.toWei(gasFeeBase, 'ether')
  const gasFeeGwei = web3.utils.fromWei(gasFeeWei, 'gwei')
  return txHash ? (
    <ExplorerLink
      networkId={chainId}
      path={`/tx/${txHash}`}
      className={styles.txHash}
    >
      View Transaction
    </ExplorerLink>
  ) : (
    <span className={styles.txHash}>
      {txCount} Transaction{txCount > 1 ? 's' : ''}{' '}
      <Conversion price={gasFees} />
      <Tooltip
        content={<p>{`Gas fee estimation with ${gasFeeGwei} gwei`}</p>}
        placement="right"
      />
    </span>
  )
}
