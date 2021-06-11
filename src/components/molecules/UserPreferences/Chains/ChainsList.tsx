import React, { ReactElement } from 'react'
import { ChainItem } from './ChainItem'
import styles from './ChainsList.module.css'

export default function ChainsList({
  title,
  chains
}: {
  title: string
  chains: number[]
}): ReactElement {
  const content = chains.map((chainId) => (
    <ChainItem key={chainId} chainId={chainId} />
  ))

  return (
    <>
      <h4 className={styles.titleGroup}>{title}</h4>
      <div className={styles.chains}>{content}</div>
    </>
  )
}
