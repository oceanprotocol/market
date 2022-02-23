import ExplorerLink from '@shared/ExplorerLink'
import React from 'react'
import styles from './TransactionCount.module.css'
import Conversion from '@shared/Price/Conversion'
import Tooltip from '@shared/atoms/Tooltip'
import { usePrices } from '@context/Prices'
import { useWeb3 } from '@context/Web3'

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
  let gasFeeBase = '0'
  let gasFeeWei = '0'
  let gasFeeGwei = '0'
  if (gasFeesOcean) {
    gasFeeBase = (+gasFeesOcean * +(prices as any)?.eth).toString()
    gasFeeBase = parseFloat(gasFeeBase).toPrecision(10).toString()
    gasFeeWei = web3.utils.toWei(gasFeeBase, 'ether')
    gasFeeGwei = web3.utils.fromWei(gasFeeWei, 'gwei')
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
