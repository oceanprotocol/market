import ExplorerLink from '@shared/ExplorerLink'
import React from 'react'
import styles from './TransactionCount.module.css'
import Conversion from '@shared/Price/Conversion'
import Tooltip from '@shared/atoms/Tooltip'
import { usePrices } from '@context/Prices'
import { useWeb3 } from '@context/Web3'
import Decimal from 'decimal.js'

Decimal.set({ toExpNeg: -18, precision: 17, rounding: 1 })

export default function TransactionCount({
  txCount,
  chainId,
  txHash,
  gasFeesOcean
}: {
  txCount: number
  chainId: number
  txHash: string
  gasFeesOcean?: string
}) {
  const { accountId, web3 } = useWeb3()
  const { prices } = usePrices()
  let gasFeeBase = 0
  let gasFeeWei = '0'
  let gasFeeGwei = '0'
  const price =
    chainId === 80001 || chainId === 137
      ? (prices as any)?.matic
      : (prices as any)?.eth

  if (gasFeesOcean && price) {
    gasFeeBase = +parseFloat(gasFeesOcean) * +price

    gasFeeWei = web3.utils.toWei(
      new Decimal(gasFeeBase.toFixed(18)).toString(),
      'ether'
    )
    gasFeeGwei = web3.utils.fromWei(new Decimal(gasFeeWei).toString(), 'gwei')
  }
  return txHash ? (
    <ExplorerLink
      networkId={chainId}
      path={`/tx/${txHash}`}
      className={styles.txHash}
    >
      View Transaction
    </ExplorerLink>
  ) : gasFeesOcean ? (
    <span className={styles.txHash}>
      {txCount} Transaction{txCount > 1 ? 's' : ''}{' '}
      <Conversion price={gasFeesOcean} />
      <Tooltip
        content={<p>{`Gas fee estimation with ${gasFeeGwei} gwei`}</p>}
        placement="right"
      />
    </span>
  ) : accountId ? (
    <span className={styles.txHash}>
      {txCount} Transaction{txCount > 1 ? 's' : ''} <Conversion price="0" />
      <Tooltip
        content={
          <p>{`An error occurred while estimating the gas fee for this artwork, please
        try again.`}</p>
        }
        placement="right"
      />
    </span>
  ) : (
    <p>Please connect your wallet to get a gas fee estimate for this artwork</p>
  )
}
