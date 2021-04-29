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
      <header className={styles.asset}>
        <AssetType
          type={type}
          accessType={accessType}
          className={styles.assetType}
        />
        <ExplorerLink
          networkId={networkId}
          path={
            networkId === 137 || networkId === 1287
              ? `tokens/${ddo?.dataToken}`
              : `token/${ddo?.dataToken}`
          }
        >
          {`${ddo?.dataTokenInfo.name} — ${ddo?.dataTokenInfo.symbol}`}
        </ExplorerLink>
      </header>

      <div className={styles.byline}>
        Published By <Publisher account={owner} />
        <p>
          <Time date={ddo?.created} relative />
          {ddo?.created !== ddo?.updated && (
            <>
              {' — '}
              <span className={styles.updated}>
                updated <Time date={ddo?.updated} relative />
              </span>
            </>
          )}
        </p>
      </div>
    </aside>
  )
}
