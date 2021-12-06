import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'
import content from '../../../../content/publish/index.json'

export default function Title({
  networkId
}: {
  networkId: number
}): ReactElement {
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
