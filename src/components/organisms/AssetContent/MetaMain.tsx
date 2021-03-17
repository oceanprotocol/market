import React, { ReactElement } from 'react'
import { useAsset } from '../../../providers/Asset'
import { useWeb3 } from '../../../providers/Web3'
import ExplorerLink from '../../atoms/ExplorerLink'
import Publisher from '../../atoms/Publisher'
import Time from '../../atoms/Time'
import styles from './MetaMain.module.css'
import AssetType from '../../atoms/AssetType'

export default function MetaMain(): ReactElement {
  const { ddo, owner, type } = useAsset()
  const { networkId } = useWeb3()
  const isCompute = Boolean(ddo?.findServiceByType('compute'))
  const accessType = isCompute ? 'compute' : 'access'

  return (
    <aside className={styles.meta}>
      <p>
        <ExplorerLink
          networkId={networkId}
          path={
            networkId === 137
              ? `tokens/${ddo?.dataToken}`
              : `token/${ddo?.dataToken}`
          }
        >
          {`${ddo?.dataTokenInfo.name} — ${ddo?.dataTokenInfo.symbol}`}
        </ExplorerLink>
      </p>
      <div>
        Published By <Publisher account={owner} />
      </div>
      <div className={styles.typeAndDate}>
        <AssetType
          type={type}
          accessType={accessType}
          className={styles.typeDetails}
        />
        <p className={styles.date}>
          <Time date={ddo?.created} relative />
          {ddo?.created !== ddo?.updated && (
            <>
              {' — '}
              updated <Time date={ddo?.updated} relative />
            </>
          )}
        </p>
      </div>
    </aside>
  )
}
