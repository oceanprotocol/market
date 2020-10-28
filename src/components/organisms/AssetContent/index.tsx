import { MetadataMarket } from '../../../@types/MetaData'
import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import { Link } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import styles from './index.module.css'
import AssetActions from '../AssetActions'
import { DDO, DID } from '@oceanprotocol/lib'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Pricing from './Pricing'
import { useOcean, usePricing } from '@oceanprotocol/react'
import EtherscanLink from '../../atoms/EtherscanLink'
import MetaItem from './MetaItem'
import Pin from './Pin'

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
  const { dtSymbol, dtName } = usePricing(ddo)

  const isOwner = accountId === ddo.publicKey[0].owner
  const hasNoPrice = ddo.price.datatoken === 0 && ddo.price.value === 0
  const showPricing = isOwner && hasNoPrice

  return (
    <article className={styles.grid}>
      <div>
        {showPricing && <Pricing ddo={ddo} />}

        <div className={styles.content}>
          <aside className={styles.meta}>
            <p className={styles.author}>{metadata?.main.author}</p>

            <p className={styles.datatoken}>
              <EtherscanLink
                networkId={networkId}
                path={`token/${ddo.dataToken}`}
              >
                {dtName ? (
                  `${dtName} - ${dtSymbol}`
                ) : (
                  <code>{ddo.dataToken}</code>
                )}
              </EtherscanLink>
            </p>

            {metadata?.additionalInformation?.categories?.length && (
              <p>
                <Link
                  to={`/search?categories=${metadata?.additionalInformation?.categories[0]}`}
                >
                  {metadata?.additionalInformation?.categories[0]}
                </Link>
              </p>
            )}
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

          <Pin did={ddo.id} />
        </div>
      </div>

      <div>
        <div className={styles.sticky}>
          <AssetActions ddo={ddo} />
        </div>
      </div>
    </article>
  )
}
