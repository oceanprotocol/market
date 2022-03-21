import React, { ReactElement } from 'react'
import NetworkItem from './NetworkItem'
import styles from './NetworksList.module.css'

export default function NetworksList({
  title,
  networks
}: {
  title: string
  networks: number[]
}): ReactElement {
  const content = networks.map((chainId) => (
    <NetworkItem key={chainId} chainId={chainId} />
  ))

  return content.length ? (
    <>
      <h4 className={styles.titleGroup}>{title}</h4>
      <div className={styles.networks}>{content}</div>
    </>
  ) : null
}
