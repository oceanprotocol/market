import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'
import content from '../../../../content/publish/index.json'
import { useWeb3 } from '@context/Web3'
import Info from '@images/info.svg'
import AvailableNetworks from 'src/components/Publish/AvailableNetworks'

export default function Title({
  networkId
}: {
  networkId: number
}): ReactElement {
  const { isSupportedOceanNetwork, accountId } = useWeb3()
  return (
    <>
      {content.title}{' '}
      {networkId && (
        <>
          into
          <NetworkName
            networkId={networkId}
            className={
              isSupportedOceanNetwork || !accountId
                ? styles.network
                : `${styles.network} ${styles.error}`
            }
          />
          <Tooltip
            content={<AvailableNetworks />}
            className={
              isSupportedOceanNetwork || !accountId
                ? styles.tooltip
                : `${styles.tooltip} ${styles.error}`
            }
          >
            <Info className={styles.infoIcon} />
          </Tooltip>
        </>
      )}
    </>
  )
}
