import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import { useWeb3 } from '@context/Web3'
import styles from './Title.module.css'
import content from '../../../content/publish/index.json'

export default function Title(): ReactElement {
  const { networkId } = useWeb3()

  return (
    <>
      {content.title}{' '}
      {networkId && (
        <>
          into <NetworkName networkId={networkId} className={styles.network} />
          <Tooltip
            content={content.tooltipNetwork}
            className={styles.tooltip}
          />
        </>
      )}
    </>
  )
}
