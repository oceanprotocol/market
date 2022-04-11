import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'
import content from '../../../../content/publish/index.json'
import { useWeb3 } from '@context/Web3'
import Info from '@images/info.svg'
import AvailableNetworks from '@shared/AvailableNetworks'

export default function Title({
  networkId
}: {
  networkId: number
}): ReactElement {
  const { isSupportedOceanNetwork } = useWeb3()
  return (
    <>
      {content.title}{' '}
      {networkId && (
        <>
          into
          <NetworkName
            networkId={networkId}
            className={
              isSupportedOceanNetwork ? styles.network : styles.wrongNetwork
            }
          />
          {isSupportedOceanNetwork ? (
            <Tooltip
              content={<AvailableNetworks />}
              className={styles.tooltip}
            />
          ) : (
            <Tooltip
              content={<AvailableNetworks />}
              className={styles.errorTooltip}
            >
              <Info className={styles.errorIcon} />
            </Tooltip>
          )}
        </>
      )}
    </>
  )
}
