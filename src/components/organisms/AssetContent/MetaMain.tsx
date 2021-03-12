import React, { ReactElement } from 'react'
import { useAsset } from '../../../providers/Asset'
import { useWeb3 } from '../../../providers/Web3'
import ExplorerLink from '../../atoms/ExplorerLink'
import Publisher from '../../atoms/Publisher'
import Time from '../../atoms/Time'
import styles from './MetaMain.module.css'

export default function MetaMain(): ReactElement {
  const { ddo, owner } = useAsset()
  const { networkId } = useWeb3()

  return (
    <aside className={styles.meta}>
      <p>
        <ExplorerLink networkId={networkId} path={`token/${ddo?.dataToken}`}>
          {`${ddo?.dataTokenInfo.name} — ${ddo?.dataTokenInfo.symbol}`}
        </ExplorerLink>
      </p>
      <div>
        Published By <Publisher account={owner} />
      </div>
      <p className={styles.date}>
        <Time date={ddo?.created} relative />
        {ddo?.created !== ddo?.updated && (
          <>
            {' — '}
            updated <Time date={ddo?.updated} relative />
          </>
        )}
      </p>
    </aside>
  )
}
