import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement } from 'react'
import { useAsset } from '../../../providers/Asset'
import EtherscanLink from '../../atoms/EtherscanLink'
import Publisher from '../../atoms/Publisher'
import Time from '../../atoms/Time'
import styles from './MetaMain.module.css'

export default function MetaMain(): ReactElement {
  const { ddo, owner } = useAsset()
  const { networkId } = useOcean()

  return (
    <aside className={styles.meta}>
      <p>
        <EtherscanLink networkId={networkId} path={`token/${ddo?.dataToken}`}>
          {`${ddo?.dataTokenInfo.name} — ${ddo?.dataTokenInfo.symbol}`}
        </EtherscanLink>
      </p>
      <p>
        Published By <Publisher account={owner} />
      </p>
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
