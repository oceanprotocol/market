import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import { useWeb3 } from '@context/Web3'
import styles from './FormTitle.module.css'
import { tooltipNetwork } from '../../../content/pages/publish/index.json'

export default function FormTitle({ title }: { title: string }): ReactElement {
  const { networkId } = useWeb3()

  return (
    <h2 className={styles.title}>
      {title}{' '}
      {networkId && (
        <>
          into <NetworkName networkId={networkId} className={styles.network} />
          <Tooltip content={tooltipNetwork} className={styles.tooltip} />
        </>
      )}
    </h2>
  )
}
