import { MetadataMarket } from '../../../@types/MetaData'
import React, { ReactElement, useEffect, useState } from 'react'
import { Link } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import styles from './index.module.css'
import AssetActions from '../AssetActions'
import { DDO } from '@oceanprotocol/lib'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Pricing from './Pricing'
import { useOcean, usePricing } from '@oceanprotocol/react'
import EtherscanLink from '../../atoms/EtherscanLink'
import Bookmark from './Bookmark'
import Publisher from '../../atoms/Publisher'
import { useAsset } from '../../../providers/Asset'

export interface AssetContentProps {
  metadata: MetadataMarket
  ddo: DDO
  path?: string
}

export default function AssetContent({
  metadata,
  ddo
}: AssetContentProps): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId, networkId } = useOcean()
  const { owner } = useAsset()
  const { dtSymbol, dtName } = usePricing(ddo)
  const [showPricing, setShowPricing] = useState(false)
  const { price } = useAsset()

  useEffect(() => {
    setShowPricing(accountId === owner && price.isConsumable === '')
  }, [accountId, owner, price])

  return (
    <article className={styles.grid}>
      <div>
        {showPricing && <Pricing ddo={ddo} />}
        <div className={styles.content}>
          {metadata?.additionalInformation?.categories?.length && (
            <p>
              <Link
                to={`/search?categories=${metadata?.additionalInformation?.categories[0]}`}
              >
                {metadata?.additionalInformation?.categories[0]}
              </Link>
            </p>
          )}

          <aside className={styles.meta}>
            <p className={styles.datatoken}>
              <EtherscanLink
                networkId={networkId}
                path={`token/${ddo.dataToken}`}
              >
                {dtName ? (
                  `${dtName} — ${dtSymbol}`
                ) : (
                  <code>{ddo.dataToken}</code>
                )}
              </EtherscanLink>
            </p>
            Published By <Publisher account={owner} />
          </aside>

          <Markdown
            className={styles.description}
            text={metadata?.additionalInformation?.description || ''}
          />

          <MetaSecondary metadata={metadata} />

          <MetaFull ddo={ddo} metadata={metadata} />

          <div className={styles.buttonGroup}>
            {/* <EditAction
              ddo={ddo}
              ocean={ocean}
              account={account}
              refetchMetadata={refetchMetadata}
            /> */}
            {/* <DeleteAction ddo={ddo} /> */}
          </div>

          {debug === true && (
            <pre>
              <code>{JSON.stringify(ddo, null, 2)}</code>
            </pre>
          )}

          <Bookmark did={ddo.id} />
        </div>
      </div>

      <div className={styles.actions}>
        <AssetActions ddo={ddo} />
      </div>
    </article>
  )
}
